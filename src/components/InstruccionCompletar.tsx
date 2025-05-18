import PrimaryButton from './PrimaryButton'

export default function InstruccionCompletar({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-clicalo-azul/20 text-clicalo-azul rounded-md p-4 mt-4 border border-clicalo-azul shadow-inner">
      <p className="text-sm font-medium mb-2">
        ✅ Haz clic solo cuando hayas terminado la encuesta.
      </p>
      <PrimaryButton onClick={onClick} className="w-full mt-2">
        ✅ Completar acción
      </PrimaryButton>
    </div>
  )
}