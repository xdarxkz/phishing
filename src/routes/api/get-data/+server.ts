import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({request}) => {
    const data = await request.json();
    console.log(JSON.stringify(data));
    return json(data);
}