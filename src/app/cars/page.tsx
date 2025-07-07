
import FetchCar from '@/lib/api'
import React from 'react'
import {Car} from "@/lib/types";
import DisplayProductComponent from "@/components/Display";

const ProductPage = async () => {
    const  data:Car[] = await FetchCar(0,5)
    console.log(data)
    return (
        <div>
            {/* <SWRComponent/> */}
            <DisplayProductComponent tagline={'Latest Updates'} heading={'New Comming'} description={'Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.'} buttonText={'View all cars'} buttonUrl={''} posts={data}/>
        </div>
    )
}

export default ProductPage
