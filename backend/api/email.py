from django.core.mail import EmailMessage
from django.core.mail.backends.smtp import EmailBackend
from django.core.exceptions import ImproperlyConfigured
import smtplib
from django.conf import settings
from utils.colors import print_yellow
import random
import hashlib

if not all([settings.WRENCHLY_EMAIL, settings.WRENCHLY_APP_KEY]):
    print_yellow("[WARNING] WRENCHLY_EMAIL key or EMAIL_APP_KEY key missing. Email disabled.")


def send_email(to_email, subject='Wrenchly Notification', body='This is a simple email from Wrenchly.'):

    try:
        if not all([settings.WRENCHLY_EMAIL, settings.WRENCHLY_APP_KEY]):
            raise EmailResponse(success=False, message="Email's host or password is not configured.")

        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.EMAIL_HOST_USER,
            to=[to_email] if isinstance(to_email, str) else to_email,
        )

        email.content_subtype = "html"

        email.send(fail_silently=False)
        return EmailResponse(success=True, message="Email sent successfully!")

    except ImproperlyConfigured as e:
        raise EmailResponse(success=False, message=f"Configuration error: {e}")

    except smtplib.SMTPAuthenticationError as e:
        raise EmailResponse(success=False, message=f"Authentication failed: {e}")

    except smtplib.SMTPException as e:
        raise EmailResponse(success=False, message=f"SMTP error: {e}")

    except Exception as e:
        raise EmailResponse(success=False, message=f"Unexpected error: {e}")


def sendSecretCodeEmail(to_email):

    secretCode = str(random.randint(100000, 999999))

    secretCodeText = f"""
            <p>O seu código secreto para atualizar a palavra-passe da sua conta, não partilhe com ninguém:</p>
            <p><b style="font-size:20px;">{secretCode}</b></p>
            """

    email = send_email(to_email, subject="Password reset", body=secretCodeText)

    if not email.success:
        return EmailException(message=email.message)
    hashedCode = hashlib.sha256(secretCode.encode()).hexdigest()
    return hashedCode


class EmailResponse:
    def __init__(self, success=True, message=None):
        self.success = success
        self.message = message


class EmailException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(message)
