import { Client } from '@notionhq/client';

export default async (req, res) => {
    try {
        const notion = new Client({ auth: process.env.NOTION_TOKEN });
        
        const response = await notion.databases.query({
            database_id: process.env.DATABASE_ID,
            sorts: [{ property: 'Fecha', direction: 'descending' }],
            filter: {
                property: 'archivo',
                files: { is_not_empty: true }
            }
        });

        const posts = response.results.map(page => {
            const title = page.properties.Nombre?.title[0]?.plain_text || '';
            const date = page.properties.Fecha?.date?.start || '';
            const imageUrl = page.properties.archivo?.files[0]?.file?.url || '';
            
            return { title, date, imageUrl };
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Notion API error:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};