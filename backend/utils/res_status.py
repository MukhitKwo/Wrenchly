from .colors import *


def print_status(res, onlyError=False):
    """
    Retorna uma mensagem de status colorida baseada no código HTTP recebido.

    - 200-299 → Verde (Sucesso)
    - 400-499 → Amarelo (Erro do cliente)
    - 500-599 → Vermelho (Erro do servidor)
    - 600+    → Roxo (Status personalizado)
    """

    status_code = res.status_code
    data = res.json()
    status_message = data.get("message")
    text = f"<!> Status: {status_code} | Message: {status_message}"

    if (200 <= status_code <= 299) and not onlyError:
        print_green(text)  # Green → success
    elif 400 <= status_code <= 499:
        print_yellow(text)  # Yellow → client error
    elif 500 <= status_code <= 599:
        print_red(text)  # Red → server error
    else:
        print_purple(text) # Purple → custom
