import axios from "axios"
import { useEffect, useState } from "react"
import { User } from '../src/generated/client';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableCaption,
    TableContainer,
    Container,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    Link as link
} from '@chakra-ui/react'
import Link from "next/link";

const Overview = ():JSX.Element => {
    const [user, setUser] = useState<User[]>([{} as User])
    
    const getData = async () => {
        const result = await axios(
            '/api/hello',
        );
        setUser((prevState) => result.data)
    }

    useEffect(() => {
        getData();
    }, [])

    return(
        <Container color={'white'} minH={'100vh'} maxW={'container.lg'}>
        <Breadcrumb mb={'3rem'}>
        <BreadcrumbItem>
            <Link href='/'>Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
            <Link href='/overview'>Database overview</Link>
        </BreadcrumbItem>
        </Breadcrumb>
        
        <TableContainer>
        <Table variant='simple'>
            <TableCaption>Database Overview </TableCaption>
            <Thead>
            <Tr>
                <Th>Email</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th isNumeric>Phone</Th>
                <Th>Publications</Th>
                <Th>OS</Th>
            </Tr>
            </Thead>
            <Tbody>
                {user.map((value) => 
                <tr key={value.email}>
                    <td>{value.email}</td>
                    <td>{value.firstName}</td>
                    <td>{value.lastName}</td>
                    <td>{value.phone}</td>
                    <td>{value.publications}</td>
                    <td>{value.os}</td>
                </tr>)}
            </Tbody>
        </Table>
        </TableContainer>
        </Container>
    )
}

export default Overview