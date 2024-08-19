import { test, expect } from '@playwright/test';


test('Creación de un Certificado con 4 firmas', async ({ page }) => {

  test.setTimeout(60000); // Establece un timeout de 60 segundos para esta prueba

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

  await page.locator('select[name="p_plantilla_usadas"]').selectOption('2467');

  await expect(page.getByText('Firma 4')).toBeVisible(); // Válido que si al colocar la plantilla de 4 firmas se muestre la firma 4
  console.log('Puede colocar la firma 4');
  await page.locator('#D_FIRMA_4').getByRole('button').click();


  await page.getByLabel('Firma 1').selectOption('PS-0637347');
  await page.getByLabel('Firma 2').selectOption('XXX254478');
  await page.getByPlaceholder('Detalle de la firma').click();
  await page.getByLabel('Firma 3').selectOption('2027604');
  await page.getByRole('button', { name: 'Aceptar' }).click();
  await page.locator('#cmb_fondo_diplomas').selectOption('1194');
  await page.locator('#selectable-veri').getByText('ASISTENCIA').click();
  await page.getByRole('row', { name: '2039914 FORCATO, CARLOS ALBERTO DN 30771383 ASISTENCIA 100 cforcato1@gmail.com - ', exact: true }).locator('div label').click();
  await page.getByRole('button', { name: 'Emitir certificados' }).click();
  await page.getByRole('button', { name: 'Si' }).click();

  // Pausar la ejecución por 15 segundos
  await page.waitForTimeout(15000);
  
  await page.getByRole('button', { name: ' Recargar Listado' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: '' }).click();
  const page1 = await page1Promise;


  await page1.close();
  page.close();
});