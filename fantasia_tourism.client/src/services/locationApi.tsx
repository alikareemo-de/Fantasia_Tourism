// Location API service to fetch countries and cities

export interface Country {
    code: string;
    name: string;
}

let countryNameMap: Map<string, string> = new Map();

export const fetchCountries = async (): Promise<Country[]> => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }

        const data = await response.json();
        const countries = data.map((country: any) => {
            // حفظ الاسم في الخريطة
            countryNameMap.set(country.cca2, country.name.common);
            return {
                code: country.cca2,
                name: country.name.common
            };
        });

        return countries.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [
            { code: 'US', name: 'United States' },
            { code: 'CA', name: 'Canada' },
            { code: 'GB', name: 'United Kingdom' },
            { code: 'DE', name: 'Germany' },
            { code: 'FR', name: 'France' },
        ];
    }
};

export const fetchCitiesByCountry = async (countryCode: string): Promise<string[]> => {
    try {
        const countryName = countryNameMap.get(countryCode) || countryCode;

        const response = await fetch(
            `https://countriesnow.space/api/v0.1/countries/cities`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: countryName })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch cities');
        }

        const data = await response.json();
        if (data.error || !data.data) {
            throw new Error('No cities found');
        }

        return data.data.sort();
    } catch (error) {
        console.error('Error fetching cities:', error);
        return ['Capital City', 'Main City', 'Other City'];
    }
};
