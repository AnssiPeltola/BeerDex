import { searchCountries } from "@/repositories/country.repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") ?? "";

  const countries = await searchCountries(search);

  return Response.json(countries);
}
