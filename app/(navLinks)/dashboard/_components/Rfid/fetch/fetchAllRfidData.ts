export async function fetchAllRfidData(){
    const res = await fetch("/api/rfid");
    const data = await res.json();
    if (!res.ok) {
        console.log(data.error);
        throw data;
    };
    return data;
}