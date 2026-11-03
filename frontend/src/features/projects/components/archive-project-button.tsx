import { useState } from 'react'
import { Archive } from 'lucide-react'
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
import type { Project } from '@/domain/models'
import { useArchiveProject } from '../hooks/use-project-mutations'

interface ArchiveProjectButtonProps {
  project: Project
  onArchived?: () => void
  size?: 'sm' | 'default'
  label?: string
}

export function ArchiveProjectButton({
  project,
  onArchived,
  size = 'sm',
  label = 'Archivar',
}: ArchiveProjectButtonProps) {
  const [open, setOpen] = useState(false)
  const archive = useArchiveProject()

  const handleArchive = () => {
    archive.mutate(project.id, {
      onSuccess: () => {
        setOpen(false)
        onArchived?.()
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size={size}
            className="text-muted-foreground hover:bg-danger-soft hover:text-danger"
          />
        }
      >
        <Archive aria-hidden="true" className="size-3.5" />
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-danger-soft text-danger">
            <Archive aria-hidden="true" className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Archivar este proyecto?</AlertDialogTitle>
          <AlertDialogDescription>
            “{project.name}” dejará de aparecer en el portafolio activo. No se
            elimina: puedes consultarlo activando “Incluir archivados”.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchive}
            disabled={archive.isPending}
            className="bg-danger text-white hover:bg-danger/90"
          >
            {archive.isPending ? 'Archivando…' : 'Archivar proyecto'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
