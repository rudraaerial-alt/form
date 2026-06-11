import os
import sqlite3
import traceback
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, render_template, request

# -----------------------------
# Paths / Storage
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))
DB_FILE_PATH = DATA_DIR / "pe_form_data.db"

# -----------------------------
# Flask app
# -----------------------------
app = Flask(__name__, template_folder="templates", static_folder="static")


# -----------------------------
# Helpers
# -----------------------------
def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_db_connection():
    ensure_data_dir()
    conn = sqlite3.connect(DB_FILE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pe_form_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sno INTEGER NOT NULL,
            pe_non_pe TEXT NOT NULL,
            category TEXT NOT NULL,
            executor TEXT NOT NULL,
            total_node_count TEXT,
            site_cell TEXT NOT NULL,
            circle TEXT,
            date_of_pe TEXT,
            pe_purpose TEXT,
            pe_purpose_sub2 TEXT,
            activity_initiator TEXT,
            activity_owner TEXT,
            activity_executor TEXT,
            deploy_approval TEXT,
            npo_kpi_approval TEXT,
            npo_at_approval TEXT,
            tss_approval TEXT,
            status TEXT,
            domain TEXT,
            remarks1 TEXT,
            remarks2 TEXT,
            remarks TEXT,
            created_at_utc TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def list_to_string(value):
    if isinstance(value, list):
        return ", ".join(str(item).strip() for item in value if str(item).strip())
    if value is None:
        return ""
    return str(value).strip()


def get_next_sno() -> int:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COALESCE(MAX(sno), 0) + 1 AS next_sno FROM pe_form_data")
    row = cursor.fetchone()
    conn.close()

    return int(row["next_sno"]) if row and row["next_sno"] else 1


def validate_payload(data: dict):
    required_fields = {
        "peNonPe": "PE / Non-PE",
        "category": "Category",
        "executor": "Executor",
        "siteCell": "Site / Cell",
    }

    for key, label in required_fields.items():
        value = data.get(key)

        if isinstance(value, list):
            if not any(str(v).strip() for v in value):
                return f"{label} select karein."
        else:
            if not str(value or "").strip():
                return f"{label} select karein."

    return None


def normalize_sno(data: dict) -> int:
    raw_sno = str(data.get("sno", "")).strip()
    if raw_sno.isdigit():
        return int(raw_sno)
    return get_next_sno()


def save_row_to_db(data: dict) -> int:
    init_db()

    sno = normalize_sno(data)
    created_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO pe_form_data (
            sno,
            pe_non_pe,
            category,
            executor,
            total_node_count,
            site_cell,
            circle,
            date_of_pe,
            pe_purpose,
            pe_purpose_sub2,
            activity_initiator,
            activity_owner,
            activity_executor,
            deploy_approval,
            npo_kpi_approval,
            npo_at_approval,
            tss_approval,
            status,
            domain,
            remarks1,
            remarks2,
            remarks,
            created_at_utc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sno,
        list_to_string(data.get("peNonPe")),
        list_to_string(data.get("category")),
        list_to_string(data.get("executor")),
        str(data.get("totalNodeCount", "")).strip(),
        list_to_string(data.get("siteCell")),
        list_to_string(data.get("circle")),
        str(data.get("dateOfPe", "")).strip(),
        list_to_string(data.get("pePurpose")),
        list_to_string(data.get("pePurposeSub2")),
        list_to_string(data.get("activityInitiator")),
        list_to_string(data.get("activityOwner")),
        list_to_string(data.get("activityExecutor")),
        list_to_string(data.get("deployApproval")),
        list_to_string(data.get("npoKpiApproval")),
        list_to_string(data.get("npoAtApproval")),
        list_to_string(data.get("tssApproval")),
        list_to_string(data.get("status")),
        list_to_string(data.get("domain")),
        list_to_string(data.get("remarks1")),
        list_to_string(data.get("remarks2")),
        str(data.get("remarks", "")).strip(),
        created_at,
    ))

    inserted_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return inserted_id


def fetch_all_records(limit=200):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            sno,
            pe_non_pe,
            category,
            executor,
            total_node_count,
            site_cell,
            circle,
            date_of_pe,
            pe_purpose,
            pe_purpose_sub2,
            activity_initiator,
            activity_owner,
            activity_executor,
            deploy_approval,
            npo_kpi_approval,
            npo_at_approval,
            tss_approval,
            status,
            domain,
            remarks1,
            remarks2,
            remarks,
            created_at_utc
        FROM pe_form_data
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))

    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def home():
    """
    Agar templates/Form.html hai to render karega.
    Agar nahi hai to simple message dikhayega.
    """
    init_db()
    try:
        return render_template("Form.html")
    except Exception:
        return jsonify({
            "status": "ok",
            "message": "App chal rahi hai. templates/Form.html add kar do agar UI chahiye."
        })


@app.get("/health")
def health():
    try:
        init_db()
        return jsonify({
            "status": "ok",
            "database_file": str(DB_FILE_PATH),
            "next_sno": get_next_sno()
        })
    except Exception as exc:
        return jsonify({
            "status": "error",
            "message": str(exc)
        }), 500


@app.get("/next-sno")
def next_sno_route():
    try:
        return jsonify({"next_sno": get_next_sno()})
    except Exception as exc:
        print("ERROR in /next-sno:", exc)
        traceback.print_exc()
        return jsonify({"next_sno": "", "error": str(exc)}), 500


@app.get("/records")
def records():
    """
    Last 200 records dekhne ke liye
    """
    try:
        rows = fetch_all_records(limit=200)
        return jsonify({
            "success": True,
            "count": len(rows),
            "data": rows
        })
    except Exception as exc:
        print("ERROR in /records:", exc)
        traceback.print_exc()
        return jsonify({"success": False, "message": str(exc)}), 500


@app.post("/submit")
def submit():
    try:
        data = request.get_json(force=True) or {}

        error_message = validate_payload(data)
        if error_message:
            return jsonify({
                "success": False,
                "message": error_message
            }), 400

        inserted_id = save_row_to_db(data)

        return jsonify({
            "success": True,
            "message": "Data database me successfully save ho gaya.",
            "record_id": inserted_id,
            "sno": normalize_sno(data),
            "database_file": str(DB_FILE_PATH)
        })

    except Exception as exc:
        print("ERROR in /submit:", exc)
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 500


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
