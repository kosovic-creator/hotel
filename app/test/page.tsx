/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState } from 'react'
type Test = {
    id: number
    ime: string
    broj: number
}
export default function GetTest() {
    const [test, setTest] = useState<Test[]>([])
    const [poruka, setPoruka] = useState<string>('')
    useEffect(() => {
        fetch('http://localhost:3000/test/api')
            .then(res => res.json())
            .then(setTest);
    }, [])
    return (
        <>
        <div>
            {test.map((t: Test) => (
                <ul key={t.id}>
                    <li>Ime: {t.ime}</li>
                    <li>Broj: {t.broj}</li>
                </ul>
            ))}
        </div>
        <div>
<form action="http://localhost:3000/test/api" method="POST">
    <input type="text" name="ime" placeholder="Ime" />
    <input type="number" name="broj" placeholder="Broj" />
    <button type="submit">Dodaj</button>
</form>
<form action="http://localhost:3000/test/api/1" method="DELETE">
    <input type="number" name="id" placeholder="ID" />
    <button type="submit">Obriši</button>
</form>
<form action="http://localhost:3000/test/api/1" method="PUT">
    <input type="number" name="id" placeholder="ID" />
    <input type="text" name="ime" placeholder="Ime" />
    <input type="number" name="broj" placeholder="Broj" />
    <button type="submit">Izmeni</button>
</form>
        </div>
        </>
    )
}
