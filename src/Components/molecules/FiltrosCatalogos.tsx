interface FiltrosProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  categoria: string;
  onCategoriaChange: (valor: string) => void;
  orden: string;
  onOrdenChange: (valor: string) => void;
  soloDisponibles: boolean;
  onSoloDisponiblesChange: (valor: boolean) => void;
  onLimpiar: () => void;
  totalResultados: number;
}

export default function FiltrosCatalogo({
  busqueda,
  onBusquedaChange,
  categoria,
  onCategoriaChange,
  orden,
  onOrdenChange,
  soloDisponibles,
  onSoloDisponiblesChange,
  onLimpiar,
  totalResultados,
}: FiltrosProps) {
  const hayFiltrosActivos =
    busqueda !== '' || categoria !== '' || orden !== '' || soloDisponibles;

  return (
    <section className="card card-minimal p-3 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar modelo, marca o descripción..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
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

        <div className="col-md-3">
          <select
            className="form-select"
            value={orden}
            onChange={(e) => onOrdenChange(e.target.value)}
          >
            <option value="">Ordenar por: Destacados</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="marca-asc">Marca: A - Z</option>
          </select>
        </div>

        <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="switchDisponibles"
              checked={soloDisponibles}
              onChange={(e) => onSoloDisponiblesChange(e.target.checked)}
            />
            <label className="form-check-label small text-secondary" htmlFor="switchDisponibles">
              Mostrar solo con stock disponible
            </label>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted">
              Mostrando <strong>{totalResultados}</strong> instrumentos
            </span>
            {hayFiltrosActivos && (
              <button
                type="button"
                className="btn btn-sm btn-outline-minimal"
                onClick={onLimpiar}
              >
                <i className="bi bi-x-lg me-1"></i> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}