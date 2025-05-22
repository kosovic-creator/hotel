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
        <div>
            {test.map((t: Test) => (
                <ul key={t.id}>
                    <li>Ime: {t.ime}</li>
                    <li>Broj: {t.broj}</li>
                </ul>
            ))}
        </div>
    )
}
