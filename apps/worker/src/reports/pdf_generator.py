"""
Feature 9: Annotated Contract Report (Downloadable PDF)
Generates color-coded PDF reports with risk highlights
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from typing import Dict, Any, List
import os
from datetime import datetime

from ..config import settings

# Color mapping for risk levels
RISK_COLORS = {
    "green": colors.Color(0.2, 0.7, 0.3),
    "yellow": colors.Color(0.9, 0.7, 0.1),
    "red": colors.Color(0.8, 0.2, 0.2)
}

async def generate_pdf_report(report_data: Dict[str, Any], document_id: str) -> str:
    """Generate a PDF report from analysis data"""
    
    # Create reports directory
    reports_dir = os.path.join(settings.UPLOAD_DIR, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    pdf_path = os.path.join(reports_dir, f"report-{document_id}.pdf")
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.Color(0.1, 0.3, 0.5)
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceBefore=20,
        spaceAfter=10,
        textColor=colors.Color(0.2, 0.2, 0.2)
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=8,
        leading=14
    )
    
    elements = []
    
    # Title
    elements.append(Paragraph("Contract Analysis Report", title_style))
    elements.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", styles['Normal']))
    elements.append(Paragraph(f"Document: {report_data.get('fileName', 'Unknown')}", styles['Normal']))
    elements.append(Paragraph(f"Type: {report_data.get('documentType', 'Unknown').replace('_', ' ').title()}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Risk Score Section
    risk_score = report_data.get("riskScore", {})
    score = risk_score.get("score", 0)
    level = risk_score.get("level", "green")
    
    elements.append(Paragraph("Risk Assessment", heading_style))
    
    risk_color = RISK_COLORS.get(level, colors.gray)
    risk_table_data = [
        ["Risk Score", f"{score}/100"],
        ["Risk Level", level.upper()],
        ["Summary", risk_score.get("summary", "No summary available")]
    ]
    
    risk_table = Table(risk_table_data, colWidths=[2*inch, 4.5*inch])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.Color(0.95, 0.95, 0.95)),
        ('BACKGROUND', (1, 1), (1, 1), risk_color),
        ('TEXTCOLOR', (1, 1), (1, 1), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(risk_table)
    elements.append(Spacer(1, 20))
    
    # Summary Section
    summary = report_data.get("summary", {})
    if summary:
        elements.append(Paragraph("Executive Summary", heading_style))
        
        bullet_points = summary.get("bulletPoints", [])
        for point in bullet_points:
            elements.append(Paragraph(f"• {point}", body_style))
        
        elements.append(Spacer(1, 10))
        
        if summary.get("paymentSummary"):
            elements.append(Paragraph(f"<b>Payment:</b> {summary['paymentSummary']}", body_style))
        
        elements.append(Spacer(1, 20))
    
    # Red Flags Section
    red_flags = report_data.get("redFlags", [])
    if red_flags:
        elements.append(Paragraph("⚠️ Red Flags & Warnings", heading_style))
        
        for flag in red_flags:
            severity = flag.get("severity", "yellow")
            color_hex = "#cc3333" if severity == "red" else "#cc9900" if severity == "yellow" else "#339933"
            
            elements.append(Paragraph(
                f'<font color="{color_hex}"><b>[{severity.upper()}]</b></font> {flag.get("issue", "")}',
                body_style
            ))
            elements.append(Paragraph(f'<i>"{flag.get("clauseText", "")[:200]}..."</i>', body_style))
            elements.append(Paragraph(f'{flag.get("explanation", "")}', body_style))
            elements.append(Spacer(1, 10))
        
        elements.append(Spacer(1, 20))
    
    # Missing Clauses Section
    missing = report_data.get("missingClauses", [])
    if missing:
        elements.append(Paragraph("📋 Missing Clauses", heading_style))
        
        for clause in missing:
            importance = clause.get("importance", "recommended")
            color_hex = "#cc3333" if importance == "critical" else "#cc9900" if importance == "important" else "#666666"
            
            elements.append(Paragraph(
                f'<font color="{color_hex}"><b>[{importance.upper()}]</b></font> {clause.get("clauseName", "")}',
                body_style
            ))
            elements.append(Paragraph(clause.get("description", ""), body_style))
            elements.append(Spacer(1, 8))
        
        elements.append(Spacer(1, 20))
    
    # Key Clauses Table
    clauses = report_data.get("extractedClauses", {})
    if clauses:
        elements.append(PageBreak())
        elements.append(Paragraph("📄 Extracted Clauses", heading_style))
        
        clause_data = [["Clause", "Value"]]
        for key, value in clauses.items():
            if value and value != "null":
                display_key = key.replace("_", " ").title()
                display_value = str(value)[:100] + "..." if len(str(value)) > 100 else str(value)
                clause_data.append([display_key, display_value])
        
        if len(clause_data) > 1:
            clause_table = Table(clause_data, colWidths=[2*inch, 4.5*inch])
            clause_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.Color(0.2, 0.4, 0.6)),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('PADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.Color(0.95, 0.95, 0.95)]),
            ]))
            elements.append(clause_table)
    
    # Suggested Fixes Section
    fixes = report_data.get("suggestedFixes", [])
    if fixes:
        elements.append(PageBreak())
        elements.append(Paragraph("✏️ Suggested Improvements", heading_style))
        
        for i, fix in enumerate(fixes, 1):
            elements.append(Paragraph(f"<b>Fix #{i}</b>", body_style))
            elements.append(Paragraph(f"<b>Original:</b> {fix.get('originalClause', '')[:200]}", body_style))
            elements.append(Paragraph(f"<b>Suggested:</b> {fix.get('fixedClause', '')[:200]}", body_style))
            elements.append(Paragraph(f"<b>Why:</b> {fix.get('explanation', '')}", body_style))
            elements.append(Spacer(1, 15))
    
    # Jurisdiction Info
    jurisdiction = report_data.get("jurisdictionInfo", {})
    if jurisdiction:
        elements.append(Paragraph("⚖️ Jurisdiction & Governing Law", heading_style))
        elements.append(Paragraph(f"<b>Governing Law:</b> {jurisdiction.get('governingLaw', 'Not specified')}", body_style))
        elements.append(Paragraph(f"<b>Jurisdiction:</b> {jurisdiction.get('jurisdiction', 'Not specified')}", body_style))
        
        warnings = jurisdiction.get("warnings", [])
        for warning in warnings:
            elements.append(Paragraph(f"<font color='#cc9900'>⚠️ {warning}</font>", body_style))
    
    # Footer
    elements.append(Spacer(1, 40))
    elements.append(Paragraph(
        "<i>This report was generated by DocIntel AI. It is for informational purposes only and does not constitute legal advice.</i>",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.gray, alignment=TA_CENTER)
    ))
    
    # Build PDF
    doc.build(elements)
    
    return pdf_path


async def generate_corrected_contract_pdf(
    original_text: str,
    analysis: Dict[str, Any],
    fixes: List[Dict[str, Any]],
    document_id: str
) -> str:
    """Generate a corrected contract PDF with fixes applied, maintaining original format"""
    
    # Create reports directory
    reports_dir = os.path.join(settings.UPLOAD_DIR, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    pdf_path = os.path.join(reports_dir, f"corrected-{document_id}.pdf")
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles matching contract format
    title_style = ParagraphStyle(
        'ContractTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=colors.black,
        fontName='Helvetica-Bold'
    )
    
    section_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        spaceBefore=15,
        spaceAfter=8,
        textColor=colors.black,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'ContractBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=8,
        leading=14,
        fontName='Helvetica'
    )
    
    fixed_style = ParagraphStyle(
        'FixedClause',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=8,
        leading=14,
        fontName='Helvetica',
        backColor=colors.Color(0.9, 1.0, 0.9),  # Light green background
        borderColor=colors.Color(0.2, 0.7, 0.3),
        borderWidth=1,
        borderPadding=5
    )
    
    elements = []
    
    # Header with "CORRECTED" watermark
    elements.append(Paragraph(
        '<font color="#228B22"><b>✓ CORRECTED CONTRACT</b></font>',
        ParagraphStyle('Watermark', parent=styles['Normal'], fontSize=10, alignment=TA_CENTER, textColor=colors.Color(0.2, 0.7, 0.3))
    ))
    elements.append(Paragraph(
        f'<font color="gray">Generated by DocIntel AI on {datetime.now().strftime("%B %d, %Y")}</font>',
        ParagraphStyle('Date', parent=styles['Normal'], fontSize=9, alignment=TA_CENTER, textColor=colors.gray)
    ))
    elements.append(Spacer(1, 20))
    
    # Apply fixes to original text
    corrected_text = original_text
    applied_fixes = []
    
    for fix in fixes:
        original_clause = fix.get("originalClause", "")
        fixed_clause = fix.get("fixedClause", "")
        if original_clause and fixed_clause and original_clause in corrected_text:
            corrected_text = corrected_text.replace(original_clause, f"[FIXED] {fixed_clause}")
            applied_fixes.append(fix)
    
    # Parse and format the contract text
    lines = corrected_text.split('\n')
    current_section = None
    
    for line in lines:
        line = line.strip()
        if not line:
            elements.append(Spacer(1, 6))
            continue
        
        # Check if it's a section header (numbered or all caps)
        is_header = False
        if line.isupper() and len(line) < 100:
            is_header = True
        elif line[0].isdigit() and '.' in line[:5]:
            is_header = True
        elif line.startswith(('SECTION', 'ARTICLE', 'CLAUSE')):
            is_header = True
        
        if is_header:
            elements.append(Paragraph(line, section_style))
        elif line.startswith('[FIXED]'):
            # This is a fixed clause - highlight it
            fixed_text = line.replace('[FIXED] ', '')
            elements.append(Paragraph(f'<font color="#228B22">✓ {fixed_text}</font>', fixed_style))
        else:
            elements.append(Paragraph(line, body_style))
    
    # Add summary of changes at the end
    if applied_fixes:
        elements.append(PageBreak())
        elements.append(Paragraph("SUMMARY OF CORRECTIONS", title_style))
        elements.append(Spacer(1, 10))
        
        for i, fix in enumerate(applied_fixes, 1):
            elements.append(Paragraph(f"<b>Correction #{i}</b>", section_style))
            elements.append(Paragraph(f"<b>Issue:</b> {fix.get('issue', 'N/A')}", body_style))
            elements.append(Paragraph(f"<b>Original:</b> <font color='#cc3333'>{fix.get('originalClause', '')[:150]}...</font>", body_style))
            elements.append(Paragraph(f"<b>Corrected:</b> <font color='#228B22'>{fix.get('fixedClause', '')[:150]}...</font>", body_style))
            elements.append(Paragraph(f"<b>Explanation:</b> {fix.get('explanation', '')}", body_style))
            elements.append(Spacer(1, 15))
    
    # Footer
    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        "<i>This corrected contract was generated by DocIntel AI. Please review all changes with legal counsel before use.</i>",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.gray, alignment=TA_CENTER)
    ))
    
    # Build PDF
    doc.build(elements)
    
    return pdf_path
