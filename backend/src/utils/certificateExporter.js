import supabase from '../config/supabase.js';
import cloudinary from '../config/cloudinary.js';
import puppeteer from 'puppeteer';
import fs from 'fs';

/**
 * Ensure all images and fonts are loaded
 */
async function waitForAssets(page) {
    await page.evaluate(async () => {
        const selectors = Array.from(document.images).map(img => {
            if (img.complete) return;
            return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            });
        });
        await Promise.all(selectors);
        await document.fonts.ready;
    });
}

/**
 * Export certificate as PNG (no container ID needed)
 */
export const exportToPng = async ({ htmlCertificate, fileName }) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlCertificate, { waitUntil: 'networkidle0' });

    await waitForAssets(page);
    

    const body = await page.$("#certificate-container");

    await page.addStyleTag({ url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' })

    await page.setViewport({
        width: 1223,
        height: 625,
        deviceScaleFactor: 2,
    });

    const imageBuffer = await body.screenshot({ omitBackground: false });

    fs.writeFileSync('puppeteer-debug.png', imageBuffer);
    await browser.close();

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'certificates', public_id: fileName, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(imageBuffer);
    });
};


/**
 * Export certificate as PDF (no container ID needed)
 */
export const exportToPdf = async ({ htmlCertificate, fileName }) => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlCertificate, { waitUntil: 'networkidle0' });
    await waitForAssets(page);

    const body = await page.$("#certificate-container");
    if (!body) throw new Error('Certificate container not found');

    await page.addStyleTag({ url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' })

    await page.waitForSelector("#certificate-container", { timeout: 30000 });

    await page.evaluateHandle("document.fonts.ready");
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
        printBackground: true,
        width: `1223px`,
        height: `680px`,
        pageRanges: '1',
    });

    await browser.close();

    // Upload PDF to Supabase
    const { data, error } = await supabase.storage
        .from('certificates')
        .upload(`${fileName}.pdf`, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
        });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    if (!data) throw new Error('Supabase returned no data after upload');

    const { data:publicUrl } = supabase.storage.from('certificates').getPublicUrl(`${data.path}`)
    return publicUrl.publicUrl; // <-- this will be stored in pdf_url
};

