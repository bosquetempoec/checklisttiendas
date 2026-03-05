exports.handler = async function(event, context) {
  const TOKEN   = process.env.NETLIFY_TOKEN;
  const SITE_ID = process.env.NETLIFY_SITE_ID;
  const FORM_NAME = "auditoria-tienda";

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    // 1. Obtener formularios del sitio
    const fRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!fRes.ok) throw new Error(`Error ${fRes.status} al obtener formularios`);
    const forms = await fRes.json();

    const form = forms.find(f => f.name === FORM_NAME);
    if (!form) throw new Error(`Formulario "${FORM_NAME}" no encontrado`);

    // 2. Obtener submissions
    const sRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions?per_page=100`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!sRes.ok) throw new Error(`Error ${sRes.status} al obtener submissions`);
    const submissions = await sRes.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(submissions)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};