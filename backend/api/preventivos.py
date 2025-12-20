def getCommonPreventives(fuel_type):
    if fuel_type == "gasoleo":
        return preventivo_gasoleo()
    elif fuel_type == "gasolina":
        return preventivo_gasolina()
    elif fuel_type == "hibrido":
        return preventivo_hibrido()
    elif fuel_type == "automatico":
        return preventivo_automatico()
    else:
        return {}


def preventivo_gasolina():
    return {
        "oleo_motor": {"descricao": "Troca de óleo + filtro", "media_km": 15000, "media_dias": 365},
        "filtro_ar": {"descricao": "Substituição do filtro de ar", "media_km": 20000, "media_dias": 365},
        "filtro_combustivel": {"descricao": "Substituição do filtro de combustível", "media_km": 40000, "media_dias": 730},
        "velas": {"descricao": "Substituição das velas de ignição", "media_km": 60000, "media_dias": 1460},
        "distribuicao": {"descricao": "Correia ou corrente (verificar)", "media_km": 120000, "media_dias": 1825},
        "refrigeracao": {"descricao": "Troca do líquido de refrigeração", "media_km": 80000, "media_dias": 1460},
        "travoes": {"descricao": "Verificação de pastilhas e discos", "media_km": 40000, "media_dias": 730},
    }


def preventivo_gasoleo():
    return {
        "oleo_motor": {"descricao": "Troca de óleo + filtro", "media_km": 15000, "media_dias": 365},
        "filtro_ar": {"descricao": "Substituição do filtro de ar", "media_km": 20000, "media_dias": 365},
        "filtro_gasoleo": {"descricao": "Substituição do filtro de gasóleo", "media_km": 30000, "media_dias": 730},
        "distribuicao": {"descricao": "Correia ou corrente (verificar)", "media_km": 140000, "media_dias": 1825},
        "egr": {"descricao": "Limpeza / verificação da válvula EGR", "media_km": 80000, "media_dias": 1095},
        "dpf": {"descricao": "Verificação do filtro de partículas (DPF)", "media_km": 120000, "media_dias": 1825},
        "injetores": {"descricao": "Verificação dos injetores", "media_km": 150000, "media_dias": 2190},
        "travoes": {"descricao": "Verificação de pastilhas e discos", "media_km": 40000, "media_dias": 730},
    }


def preventivo_hibrido():
    return {
        "oleo_motor": {"descricao": "Troca de óleo + filtro (motor térmico)", "media_km": 15000, "media_dias": 365},
        "filtro_ar": {"descricao": "Substituição do filtro de ar", "media_km": 20000, "media_dias": 365},
        "bateria": {"descricao": "Verificação da bateria híbrida", "media_km": 160000, "media_dias": 2920},
        "arrefecimento_bateria": {"descricao": "Sistema de arrefecimento da bateria", "media_km": 100000, "media_dias": 1825},
        "software": {"descricao": "Diagnóstico / atualização de software", "media_km": 50000, "media_dias": 730},
        "travoes": {"descricao": "Verificação dos travões", "media_km": 60000, "media_dias": 1095},
    }


def preventivo_automatico():
    return {
        "oleo_caixa": {"descricao": "Substituição do óleo da caixa automática", "media_km": 60000, "media_dias": 1460},
        "filtro_caixa": {"descricao": "Substituição do filtro da caixa", "media_km": 60000, "media_dias": 1460},
        "conversor_binario": {"descricao": "Diagnóstico do conversor de binário", "media_km": 120000, "media_dias": 1825},
        "calibracao": {"descricao": "Calibração / adaptação da caixa", "media_km": 80000, "media_dias": 1460},
    }
