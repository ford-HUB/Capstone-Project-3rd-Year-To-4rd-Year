export const renderPreview = (html = "") => {
    return `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          .certificate-container {
            max-width: 100%;
            max-height: 100%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
            background: white;
          }
          .certificate-container > * {
            max-width: 100%;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          ${html
            .replace(/{{participant_name}}/g, "One Dev")
            .replace(/{{event_title}}/g, "UCLM CARES Community Health Screening Volunteer Event")
            .replace(/{{certificate_type}}/g, "APPRECIATION")
            .replace(/{{issued_date}}/g, "September 11, 2025")
            .replace(/{{cert_uuid}}/g, "CERT-2025-001")
            .replace(/{{director_name}}/g, "Richie Montibon")
            .replace(/{{director_signatory_img}}/g, "https://wallpapers.com/images/featured/blank-white-7sn5o1woonmklx1h.jpg")
            .replace(/{{official_signatory_name}}/g, "Jesieca Reyes")
            .replace(/{{official_signatory_role}}/g, "Coordinator")
            .replace(/{{additional_signatory_img}}/g, "https://wallpapers.com/images/featured/blank-white-7sn5o1woonmklx1h.jpg")
        }
            
        </div>
      </body>
    </html>`;
};