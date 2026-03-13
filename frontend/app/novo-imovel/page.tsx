"use client"

import { useState } from "react"

export default function NovoImovel() {

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [fotos, setFotos] = useState<FileList | null>(null)

  async function salvar(e:any){
    e.preventDefault()

    const formData = new FormData()

    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("preco", preco)
    formData.append("cidade", cidade)
    formData.append("estado", estado)

    if(fotos){
      for(let i=0;i<fotos.length;i++){
        formData.append("fotos", fotos[i])
      }
    }

    await fetch("/api/imoveis", {

      method:"POST",
      body: formData

    })

    alert("Imóvel cadastrado")

  }

  return(

    <div style={{padding:40}}>

      <h1>Novo Imóvel</h1>

      <form onSubmit={salvar}>

        <input placeholder="Título"
        onChange={e=>setTitulo(e.target.value)}
        /><br/><br/>

        <textarea placeholder="Descrição"
        onChange={e=>setDescricao(e.target.value)}
        /><br/><br/>

        <input placeholder="Preço"
        onChange={e=>setPreco(e.target.value)}
        /><br/><br/>

        <input placeholder="Cidade"
        onChange={e=>setCidade(e.target.value)}
        /><br/><br/>

        <input placeholder="Estado"
        onChange={e=>setEstado(e.target.value)}
        /><br/><br/>

        <input type="file" multiple
        onChange={e=>setFotos(e.target.files)}
        /><br/><br/>

        <button type="submit">

          Salvar

        </button>

      </form>

    </div>

  )

}