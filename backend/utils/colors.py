# utils/colors.py
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)  # automatically resets color after each print

def print_red(text):
    print(Fore.RED + Style.BRIGHT + text)

def print_green(text):
    print(Fore.GREEN + Style.BRIGHT + text)

def print_yellow(text):
    print(Fore.YELLOW + Style.BRIGHT + text)

def print_purple(text):
    print(Fore.MAGENTA + Style.BRIGHT + text)
