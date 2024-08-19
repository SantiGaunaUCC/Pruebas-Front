import { test, expect } from '@playwright/test';

test('Creación de Certificados para Todos los Marcos', async ({ page }) => {

  test.setTimeout(1200000); // Establece un timeout de 20 min para esta prueba

  // Datos del login
  await page.goto('https://siuccdev.ucc.edu.ar/siuccwebv1/staging/login');
  await page.getByPlaceholder('Clave').fill('2457207');
  await page.getByPlaceholder('Contraseña').fill('SantiG2120');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

  // Navegar a la página de emisión de certificados
  await page.getByTitle('Menú Principal', { exact: true }).click();
  await page.locator('a.menu-item[data-id="1140"]').click();
  await page.getByRole('link', { name: ' EMISION CERTIFICADOS - PARTICIPANTES' }).click();
  await page.getByRole('row', { name: '14 Teo. 19565 CONVERSACIONES' }).getByRole('button').click();

  // Seleccionar la plantilla del certificado
  await page.locator('select[name="p_plantilla_usadas"]').selectOption('1207');

  // Obtener todas las opciones de marco
  const marcos = await page.locator('#cmb_fondo_diplomas option').all();

  for (const marco of marcos) {
    try {
      const value = await marco.getAttribute('value');
      const text = await marco.textContent();

      if (value && value !== 's' && text !== null) { // Omite la opción de selección y verifica que text no sea null
        console.log(`Procesando marco: ${text.trim()}`);

        // Seleccionar el marco
        await page.locator('#cmb_fondo_diplomas').selectOption(value, { timeout: 30000 });

        // Opciones
        await page.locator('#selectable-veri').getByText('ASISTENCIA').click({ timeout: 30000 });
        await page.locator('label[for="alumnos_2039914"]').click();

        // Emitir certificados
        await page.getByRole('button', { name: 'Emitir certificados' }).click();
        await page.getByRole('button', { name: 'Si' }).click();

        // Esperar a que el mensaje aparezca en la página
        const mensaje = await page.locator('text=Solicitud de generación de certificados enviado');
        await expect(mensaje).toBeVisible();

        // Pausar la ejecución por 15 segundos
        await page.waitForTimeout(15000);

        // Recargar listado
        await page.getByRole('button', { name: ' Recargar Listado' }).click();

        // Manejo del popup
        try {
          const [popup] = await Promise.all([
            page.waitForEvent('popup', { timeout: 60000 }), // Espera el popup
            page.getByRole('button', { name: '' }).click() // Acción que debería abrir el popup
          ]);

          if (popup) {
            await popup.waitForLoadState(); // Espera a que el popup esté completamente cargado
            await popup.close();
          } else {
            console.error(`No se abrió el popup para el marco ${text.trim()}`);
          }
        } catch (error) {
          console.error(`Error al esperar el popup para el marco ${text.trim()}: ${error.message}`);
        }

      } else {
        console.warn(`Opción de marco inválida o texto es nulo para: ${value}`);
      }
    } catch (error) {
      console.error(`Error al procesar el marco ${marco}: ${error.message}`);
    }
  }

  // Cerrar la página principal al final del proceso
  await page.close();
});
