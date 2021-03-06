import React from 'react'
import { Helmet } from 'react-helmet-async'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { VStack } from '../components/Stack'
import ProductList from '../ProductList'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Demo - Products</title>
      </Helmet>

      <Box pt="16px">
        <Container>
          <VStack spacing={24}>
            <Typography component="h1" variant="h3">
              Product List
            </Typography>
            <ProductList />
          </VStack>
        </Container>
      </Box>
    </>
  )
}
