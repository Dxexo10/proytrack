import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useResetDemo } from '../hooks/use-reset-demo'

export function ResetDemoButton() {
  const [open, setOpen] = useState(false)
  const reset = useResetDemo()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        <RotateCcw aria-hidden="true" className="size-4" />
        Restablecer datos
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-warning-soft text-warning">
            <RotateCcw aria-hidden="true" className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Restablecer los datos demo?</AlertDialogTitle>
          <AlertDialogDescription>
            Se descartan los proyectos, versiones, alertas y actividad que hayas
            creado. El dataset determinista volverá a su estado inicial.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={reset.isPending}
            onClick={() => {
              reset.mutate(undefined, {
                onSuccess: () => setOpen(false),
              })
            }}
          >
            {reset.isPending ? 'Restableciendo…' : 'Restablecer demo'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
