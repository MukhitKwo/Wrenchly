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
        {"nome": "Óleo Motor", "descricao": "Troca de óleo do motor e filtro para manter desempenho ideal", "media_km": 15000, "media_dias": 365},
        {"nome": "Filtro de Ar", "descricao": "Substituição do filtro de ar para otimizar a combustão", "media_km": 20000, "media_dias": 365},
        {"nome": "Filtro de Combustível", "descricao": "Substituição do filtro de combustível para proteger o motor", "media_km": 40000, "media_dias": 730},
        {"nome": "Velas de Ignição", "descricao": "Substituição das velas para garantir ignição eficiente", "media_km": 60000, "media_dias": 1460},
        {"nome": "Correia/Distribuição", "descricao": "Verificação da correia ou corrente de distribuição", "media_km": 120000, "media_dias": 1825},
        {"nome": "Refrigeração", "descricao": "Troca do líquido de refrigeração para evitar superaquecimento", "media_km": 80000, "media_dias": 1460},
        {"nome": "Travões", "descricao": "Verificação de pastilhas e discos de travão", "media_km": 40000, "media_dias": 730},
    ]


def preventivo_gasoleo():
    return [
        {"nome": "Óleo Motor", "descricao": "Troca de óleo do motor e filtro para proteger o motor diesel", "media_km": 15000, "media_dias": 365},
        {"nome": "Filtro de Ar", "descricao": "Substituição do filtro de ar para melhor combustão", "media_km": 20000, "media_dias": 365},
        {"nome": "Filtro de Gasóleo", "descricao": "Substituição do filtro de gasóleo para prevenir entupimentos", "media_km": 30000, "media_dias": 730},
        {"nome": "Correia/Distribuição", "descricao": "Verificação da correia ou corrente de distribuição", "media_km": 140000, "media_dias": 1825},
        {"nome": "Válvula EGR", "descricao": "Limpeza ou verificação da válvula EGR para emissões ideais", "media_km": 80000, "media_dias": 1095},
        {"nome": "DPF", "descricao": "Verificação do filtro de partículas (DPF) para performance e emissões", "media_km": 120000, "media_dias": 1825},
        {"nome": "Injetores", "descricao": "Verificação do estado dos injetores de combustível", "media_km": 150000, "media_dias": 2190},
        {"nome": "Travões", "descricao": "Verificação de pastilhas e discos de travão", "media_km": 40000, "media_dias": 730},
    ]


def preventivo_hibrido():
    return [
        {"nome": "Óleo Motor", "descricao": "Troca de óleo do motor térmico e filtro", "media_km": 15000, "media_dias": 365},
        {"nome": "Filtro de Ar", "descricao": "Substituição do filtro de ar para motor híbrido", "media_km": 20000, "media_dias": 365},
        {"nome": "Bateria Híbrida", "descricao": "Verificação do estado da bateria híbrida", "media_km": 160000, "media_dias": 2920},
        {"nome": "Arrefecimento da Bateria", "descricao": "Verificação do sistema de arrefecimento da bateria", "media_km": 100000, "media_dias": 1825},
        {"nome": "Software", "descricao": "Diagnóstico e atualização do software do veículo híbrido", "media_km": 50000, "media_dias": 730},
        {"nome": "Travões", "descricao": "Verificação completa dos travões", "media_km": 60000, "media_dias": 1095},
    ]


def preventivo_automatico():
    return [
        {"nome": "Óleo da Caixa", "descricao": "Substituição do óleo da caixa automática para bom funcionamento", "media_km": 60000, "media_dias": 1460},
        {"nome": "Filtro da Caixa", "descricao": "Substituição do filtro da caixa automática", "media_km": 60000, "media_dias": 1460},
        {"nome": "Conversor de Binário", "descricao": "Diagnóstico do conversor de binário da caixa automática", "media_km": 120000, "media_dias": 1825},
        {"nome": "Calibração da Caixa", "descricao": "Calibração e adaptação da caixa automática", "media_km": 80000, "media_dias": 1460},
    ]
