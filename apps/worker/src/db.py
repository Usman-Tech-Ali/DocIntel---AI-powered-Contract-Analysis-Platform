"""SQLite Database for persistent storage"""
import sqlite3
import json
import os
from datetime import datetime
from typing import Optional, Dict, Any, List
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "docintel.db")

def init_db():
    """Initialize the database with required tables"""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Documents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                file_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                mime_type TEXT,
                file_size INTEGER,
                uploaded_at TEXT NOT NULL,
                status TEXT DEFAULT 'uploaded',
                raw_text TEXT
            )
        """)
        
        # Analyses table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                document_id TEXT NOT NULL,
                document_type TEXT,
                detected_language TEXT,
                analyzed_at TEXT NOT NULL,
                summary TEXT,
                risk_score TEXT,
                extracted_clauses TEXT,
                missing_clauses TEXT,
                red_flags TEXT,
                jurisdiction_info TEXT,
                FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()

@contextmanager
def get_connection():
    """Get a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Document operations
def save_document(doc: Dict[str, Any]) -> None:
    """Save a document to the database"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO documents 
            (id, file_name, file_path, mime_type, file_size, uploaded_at, status, raw_text)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc["id"],
            doc["fileName"],
            doc["filePath"],
            doc.get("mimeType"),
            doc.get("fileSize"),
            doc["uploadedAt"],
            doc.get("status", "uploaded"),
            doc.get("rawText")
        ))
        conn.commit()

def get_document(doc_id: str) -> Optional[Dict[str, Any]]:
    """Get a document by ID"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
        row = cursor.fetchone()
        if row:
            return {
                "id": row["id"],
                "fileName": row["file_name"],
                "filePath": row["file_path"],
                "mimeType": row["mime_type"],
                "fileSize": row["file_size"],
                "uploadedAt": row["uploaded_at"],
                "status": row["status"],
                "rawText": row["raw_text"]
            }
        return None

def update_document_status(doc_id: str, status: str, raw_text: str = None) -> None:
    """Update document status and optionally raw text"""
    with get_connection() as conn:
        cursor = conn.cursor()
        if raw_text:
            cursor.execute("UPDATE documents SET status = ?, raw_text = ? WHERE id = ?", (status, raw_text, doc_id))
        else:
            cursor.execute("UPDATE documents SET status = ? WHERE id = ?", (status, doc_id))
        conn.commit()

def list_documents() -> List[Dict[str, Any]]:
    """List all documents"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents ORDER BY uploaded_at DESC")
        rows = cursor.fetchall()
        return [{
            "id": row["id"],
            "fileName": row["file_name"],
            "filePath": row["file_path"],
            "mimeType": row["mime_type"],
            "fileSize": row["file_size"],
            "uploadedAt": row["uploaded_at"],
            "status": row["status"]
        } for row in rows]

def delete_document(doc_id: str) -> None:
    """Delete a document"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        cursor.execute("DELETE FROM analyses WHERE document_id = ?", (doc_id,))
        conn.commit()

# Analysis operations
def save_analysis(analysis: Dict[str, Any]) -> None:
    """Save an analysis to the database"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO analyses 
            (id, document_id, document_type, detected_language, analyzed_at, 
             summary, risk_score, extracted_clauses, missing_clauses, red_flags, jurisdiction_info)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            analysis["id"],
            analysis["documentId"],
            analysis.get("documentType"),
            analysis.get("detectedLanguage"),
            analysis["analyzedAt"],
            json.dumps(analysis.get("summary", {})),
            json.dumps(analysis.get("riskScore", {})),
            json.dumps(analysis.get("extractedClauses", {})),
            json.dumps(analysis.get("missingClauses", [])),
            json.dumps(analysis.get("redFlags", [])),
            json.dumps(analysis.get("jurisdictionInfo", {}))
        ))
        conn.commit()

def get_analysis(doc_id: str) -> Optional[Dict[str, Any]]:
    """Get analysis by document ID"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM analyses WHERE document_id = ?", (doc_id,))
        row = cursor.fetchone()
        if row:
            return {
                "id": row["id"],
                "documentId": row["document_id"],
                "documentType": row["document_type"],
                "detectedLanguage": row["detected_language"],
                "analyzedAt": row["analyzed_at"],
                "summary": json.loads(row["summary"] or "{}"),
                "riskScore": json.loads(row["risk_score"] or "{}"),
                "extractedClauses": json.loads(row["extracted_clauses"] or "{}"),
                "missingClauses": json.loads(row["missing_clauses"] or "[]"),
                "redFlags": json.loads(row["red_flags"] or "[]"),
                "jurisdictionInfo": json.loads(row["jurisdiction_info"] or "{}")
            }
        return None

def get_analysis_with_raw_text(doc_id: str) -> Optional[Dict[str, Any]]:
    """Get analysis with raw text from document"""
    analysis = get_analysis(doc_id)
    if analysis:
        doc = get_document(doc_id)
        if doc:
            analysis["rawText"] = doc.get("rawText", "")
    return analysis

# Initialize database on import
init_db()
