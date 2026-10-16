import json
import unicodedata
from pathlib import Path
import openpyxl

raiz = Path(__file__).resolve().parent.parent
libro = openpyxl.load_workbook(raiz / 'input referencia cartas.xlsx', read_only=True, data_only=True)
por_ruta = {}
cajas = {}
for hoja in libro:
    filas = list(hoja.values)
    ruta_col = filas[0].index('ruta_recursos')
    caja_col = filas[0].index('caja')
    for fila in filas[1:]:
        ruta, nombre = fila[ruta_col], fila[caja_col]
        if not ruta:
            continue
        if not nombre:
            raise ValueError(f'Caja sin confirmar: {ruta}')
        nombre = 'Core' if nombre.lower() in ('base', 'core') else nombre
        simple = unicodedata.normalize('NFKD', nombre).encode('ascii', 'ignore').decode().lower()
        caja_id = '-'.join(simple.split())
        if caja_id in cajas and cajas[caja_id] != nombre:
            raise ValueError('IDs de caja duplicados')
        cajas[caja_id] = nombre
        por_ruta[f'recursos/{ruta}'] = caja_id

def leer(nombre):
    return json.loads((raiz / 'datos' / nombre).read_text(encoding='utf-8'))

fichas = [*leer('mazo_base.json')['cartas'], *leer('catalogo_enemigos_borrador.json')['enemigos'],
          *leer('cartas_expansion_pendientes.json')['cartas'], *leer('referencias_borrador.json')['referencias'],
          *leer('mazo_daily.json')['cartas']]
cartas = []
for ficha in fichas:
    rutas = [ficha.get(k) for k in ('imagen', 'imagen_original', 'imagen_es')]
    rutas += ficha.get('variantes_por_revisar', [])
    asignaciones = {por_ruta[r] for r in rutas if r in por_ruta}
    if len(asignaciones) > 1:
        raise ValueError(f'Variante con otra caja: {ficha["id"]}')
    if asignaciones:
        cartas.append({'id': ficha['id'], 'cajaId': asignaciones.pop()})

resultado = {'version': 1, 'fuente': 'input referencia cartas.xlsx',
             'cajas': [{'id': i, 'nombre': n, 'obligatoria': i == 'core'} for i, n in cajas.items()],
             'cartas': cartas}
(raiz / 'datos' / 'coleccion.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Coleccion importada: {len(cajas)} cajas, {len(cartas)} asociaciones por ID; Excel sin modificaciones.')
