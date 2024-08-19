import { test, expect } from '@playwright/test';

test('Creación de un Certificado, colocando un marco', async ({ page }) => {

  test.setTimeout(60000); // Establece un timeout de 60 segundos para esta prueba

  await page.goto('https://siuccdev.ucc.edu.ar/siuccwebv1/staging/login');
  await page.getByPlaceholder('Clave').click();
  await page.getByPlaceholder('Clave').click();
  await page.getByPlaceholder('Clave').fill('2457207');
  await page.getByPlaceholder('Contraseña').click();
  await page.getByPlaceholder('Contraseña').press('CapsLock');
  await page.getByPlaceholder('Contraseña').fill('S');
  await page.getByPlaceholder('Contraseña').press('CapsLock');
  await page.getByPlaceholder('Contraseña').fill('Santi');
  await page.getByPlaceholder('Contraseña').press('CapsLock');
  await page.getByPlaceholder('Contraseña').fill('SantiG');
  await page.getByPlaceholder('Contraseña').press('CapsLock');
  await page.getByPlaceholder('Contraseña').fill('SantiG2120');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByTitle('Menú Principal', { exact: true }).click();
  await page.locator('a.menu-item[data-id="1140"]').click();
  await page.getByRole('link', { name: ' EMISION CERTIFICADOS - PARTICIPANTES' }).click();
  await page.getByRole('row', { name: '14 Teo. 19565 CONVERSACIONES' }).getByRole('button').click();
  await page.locator('select[name="p_plantilla_usadas"]').selectOption('1207');
  await page.locator('#cmb_fondo_diplomas').selectOption('1191'); // Marco -> diploma con marco crianza
  await page.locator('#selectable-veri').getByText('ASISTENCIA').click();


  await page.locator('label[for="alumnos_2039914"]').click();

  await page.getByRole('button', { name: 'Emitir certificados' }).click();
  await page.getByRole('button', { name: 'Si' }).click();

  
  // Esperar a que el mensaje aparezca en la página
  const mensaje = await page.locator('text=Solicitud de generación de certificados enviado');

  // Verificar que el mensaje es visible
  await expect(mensaje).toBeVisible();

  // Pausar la ejecución por 15 segundos
  await page.waitForTimeout(15000);

  await page.getByRole('button', { name: ' Recargar Listado' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: '' }).click();
  const page1 = await page1Promise;


  await page1.close();
  page.close();
});