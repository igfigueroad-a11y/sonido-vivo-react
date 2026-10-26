interface FiltrosProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  categoria: string;
  onCategoriaChange: (valor: string) => void;
}

export default function FiltrosCatalogo({ busqueda, onBusquedaChange, categoria, onCategoriaChange }: FiltrosProps) {
  return (
    <section className="row g-3 mb-4">
      <div className="col-md-7">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Buscar por modelo, marca o descripción..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>
      <div className="col-md-5">
        <select
          className="form-select form-select-lg"
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Guitarras Acústicas">Guitarras Acústicas</option>
          <option value="Guitarras Eléctricas">Guitarras Eléctricas</option>
          <option value="Bajos Eléctricos">Bajos Eléctricos</option>
          <option value="Baterías">Baterías</option>
          <option value="Teclados y Pianos">Teclados y Pianos</option>
          <option value="Amplificadores">Amplificadores</option>
          <option value="Micrófonos">Micrófonos</option>
          <option value="Pedales de Efectos">Pedales de Efectos</option>
          <option value="Accesorios">Accesorios</option>
        </select>
      </div>
    </section>
  );
}