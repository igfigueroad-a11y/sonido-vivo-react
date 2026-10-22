import { useState } from 'react'
import HeaderTienda from './Components/organism/HeaderTienda'
import FiltrosCatalogo from './Components/molecules/FiltrosCatalogos'
import CarruselHero from './Components/molecules/CarruselHero'
import SeccionInformacion from './Components/organism/SeccionInformacion'
import FooterTienda from './Components/organism/FooterTienda'
import ModalInformacion from './Components/organism/ModalInformacion'

export default function App() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')

  return (
    <>
      <HeaderTienda />

      <main className="container py-4">
        {/* Buscador y filtro por categoría */}
        <FiltrosCatalogo
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          categoria={categoria}
          onCategoriaChange={setCategoria}
        />

        {/* Carrusel promocional */}
        <CarruselHero />

        {/* Contenedor del catálogo */}
        <section id="catalogo" className="mb-5">
          <h2 className="h4 mb-3">Catálogo de instrumentos</h2>
          
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {/* Aquí renderizaremos las tarjetas de productos dinámicamente */}
          </div>
        </section>

        {/* Acordeón de información de la tienda */}
        <SeccionInformacion />
      </main>

      {/* Footer y Modal */}
      <FooterTienda />
      <ModalInformacion />
    </>
  )
}