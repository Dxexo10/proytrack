import type { User } from '@/domain/models'

export const DEMO_USERS: User[] = [
  {
    id: 'usr_0001',
    name: 'Sofía Herrera',
    email: 'sofia.herrera@trazo.demo',
    role: 'manager',
  },
  {
    id: 'usr_0002',
    name: 'Diego Salazar',
    email: 'diego.salazar@trazo.demo',
    role: 'manager',
  },
  {
    id: 'usr_0003',
    name: 'Camila Rojas',
    email: 'camila.rojas@trazo.demo',
    role: 'analyst',
  },
  {
    id: 'usr_0004',
    name: 'Andrés Paredes',
    email: 'andres.paredes@trazo.demo',
    role: 'manager',
  },
  {
    id: 'usr_0005',
    name: 'Valeria Chávez',
    email: 'valeria.chavez@trazo.demo',
    role: 'analyst',
  },
  {
    id: 'usr_0006',
    name: 'Martín Quispe',
    email: 'martin.quispe@trazo.demo',
    role: 'manager',
  },
  {
    id: 'usr_0007',
    name: 'Lucía Fernández',
    email: 'lucia.fernandez@trazo.demo',
    role: 'analyst',
  },
  {
    id: 'usr_0008',
    name: 'Jorge Mendoza',
    email: 'jorge.mendoza@trazo.demo',
    role: 'manager',
  },
  {
    id: 'usr_0009',
    name: 'Renata Aliaga',
    email: 'renata.aliaga@trazo.demo',
    role: 'analyst',
  },
  {
    id: 'usr_0010',
    name: 'Bruno Cárdenas',
    email: 'bruno.cardenas@trazo.demo',
    role: 'manager',
  },
]

export const DEMO_CURRENT_USER = DEMO_USERS[0] as User
