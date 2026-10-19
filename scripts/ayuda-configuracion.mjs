// Navegación real de la interfaz para las verificaciones de navegador.
export async function abrirSeccionesConfiguracion(p,pestana,secciones=[]){
 await p.getByRole('tab',{name:pestana,exact:true}).click();
 for(const id of secciones){const d=p.locator(`#config-seccion-${id}`);if(!await d.evaluate(e=>e.open))await d.locator(':scope>summary').click();}
}
