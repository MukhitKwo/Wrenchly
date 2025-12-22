def getCarPreventivesIssues(fuel_type):
    if fuel_type == "gasoleo":
        return preventivo_gasoleo()
    elif fuel_type == "gasolina":
        return preventivo_gasolina()
    elif fuel_type == "hibrido":
        return preventivo_hibrido()
    elif fuel_type == "eletrico":
        return preventivo_automatico()
    else:
        return {}


def preventivo_gasolina():
    return [
        {"nome": "oleo_motor", "descricao": "Troca de óleo + filtro", "media_km": 15000, "media_dias": 365},
        {"nome": "filtro_ar", "descricao": "Substituição do filtro de ar", "media_km": 20000, "media_dias": 365},
        {"nome": "filtro_combustivel", "descricao": "Substituição do filtro de combustível", "media_km": 40000, "media_dias": 730},
        {"nome": "velas", "descricao": "Substituição das velas de ignição", "media_km": 60000, "media_dias": 1460},
        {"nome": "distribuicao",
            "descricao": "Correia ou corrente (verificar)", "media_km": 120000, "media_dias": 1825},
        {"nome": "refrigeracao", "descricao": "Troca do líquido de refrigeração", "media_km": 80000, "media_dias": 1460},
        {"nome": "travoes", "descricao": "Verificação de pastilhas e discos", "media_km": 40000, "media_dias": 730},
    ]


def preventivo_gasoleo():
    return [
        {"nome": "oleo_motor", "descricao": "Troca de óleo + filtro", "media_km": 15000, "media_dias": 365},
        {"nome": "filtro_ar", "descricao": "Substituição do filtro de ar", "media_km": 20000, "media_dias": 365},
        {"nome": "filtro_gasoleo", "descricao": "Substituição do filtro de gasóleo", "media_km": 30000, "media_dias": 730},
        {"nome": "distribuicao",
            "descricao": "Correia ou corrente (verificar)", "media_km": 140000, "media_dias": 1825},
        {"nome": "egr", "descricao": "Limpeza / verificação da válvula EGR", "media_km": 80000, "media_dias": 1095},
        {"nome": "dpf",
            "descricao": "Verificação do filtro de partículas (DPF)", "media_km": 120000, "media_dias": 1825},
        {"nome": "injetores", "descricao": "Verificação dos injetores", "media_km": 150000, "media_dias": 2190},
        {"nome": "travoes", "descricao": "Verificação de pastilhas e discos", "media_km": 40000, "media_dias": 730},
    ]


def preventivo_hibrido():
    return [
        {"nome": "oleo_motor",
            "descricao": "Troca de óleo + filtro (motor térmico)", "media_km": 15000, "media_dias": 365},
        {"nome": "filtro_ar", "descricao": "Substituição do filtro de ar", "media_km": 20000, "media_dias": 365},
        {"nome": "bateria", "descricao": "Verificação da bateria híbrida", "media_km": 160000, "media_dias": 2920},
        {"nome": "arrefecimento_bateria", "descricao": "Sistema de arrefecimento da bateria", "media_km": 100000, "media_dias": 1825},
        {"nome": "software", "descricao": "Diagnóstico / atualização de software", "media_km": 50000, "media_dias": 730},
        {"nome": "travoes", "descricao": "Verificação dos travões", "media_km": 60000, "media_dias": 1095},
    ]


def preventivo_automatico():
    return [
        {"nome": "oleo_caixa", "descricao": "Substituição do óleo da caixa automática", "media_km": 60000, "media_dias": 1460},
        {"nome": "filtro_caixa", "descricao": "Substituição do filtro da caixa", "media_km": 60000, "media_dias": 1460},
        {"nome": "conversor_binario", "descricao": "Diagnóstico do conversor de binário", "media_km": 120000, "media_dias": 1825},
        {"nome": "calibracao", "descricao": "Calibração / adaptação da caixa", "media_km": 80000, "media_dias": 1460},
    ]
