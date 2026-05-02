import sys
import os
from weasyprint import HTML

def generate_pdf(html_path, pdf_path):
    print(f"Generating PDF from {html_path} to {pdf_path}...")
    try:
        # Base_url ensures relative assets are found (though we use internal styles mostly)
        HTML(filename=html_path, base_url=os.path.dirname(html_path)).write_pdf(pdf_path)
        print("PDF generated successfully!")
    except Exception as e:
        print(f"Error generating PDF: {e}")
        sys.exit(1)

if __name__ == "__main__":
    html_file = "assets/itinerario.html"
    pdf_file = "assets/itinerario.pdf"
    generate_pdf(html_file, pdf_file)
