export default async function FetchCar(){
    const res = await fetch(`https://car-nextjs-api.cheatdev.online/cars`);

    const data = await res.json();
    return data;
}