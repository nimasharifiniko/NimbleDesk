import io
import qrcode

class QRCodeGeneratorService:
    """
    Generates PNG image bytes for business QR codes.
    """
    def generate_qr_code(self, target_url: str) -> bytes:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(target_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        return buffer.getvalue()

qr_generator_service = QRCodeGeneratorService()
