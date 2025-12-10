from django.core.mail import EmailMessage
from django.core.mail.backends.smtp import EmailBackend
from django.core.exceptions import ImproperlyConfigured
import smtplib
from django.conf import settings
from utils.colors import print_yellow

if not all([settings.WRENCHLY_EMAIL, settings.EMAIL_APP_KEY]):
    print_yellow("[WARNING] WRENCHLY_EMAIL key or EMAIL_APP_KEY key missing. Email disabled.")


def send_email(to_email, subject='Wrenchly Notification', body='This is a simple email from Wrenchly.'):

    try:
        if not all([settings.WRENCHLY_EMAIL, settings.EMAIL_APP_KEY]):
            raise ImproperlyConfigured("Email's host or password is not configured.")

        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.EMAIL_HOST_USER,
            to=[to_email] if isinstance(to_email, str) else to_email,
        )
        email.send(fail_silently=False)
        print("Email sent successfully!")

    except ImproperlyConfigured as e:
        print(f"Configuration error: {e}")

    except smtplib.SMTPAuthenticationError as e:
        print(f"Authentication failed: {e}")

    except smtplib.SMTPException as e:
        print(f"SMTP error: {e}")

    except Exception as e:
        print(f"Unexpected error: {e}")
