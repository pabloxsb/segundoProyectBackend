const fs = require('fs');

class productManager {
    constructor (path) {
        this.path = path
        }

   
    async addProduct(product){
        try {
            const productsFile = await this.getProducts();
            
                if (!product.title || !product.description || product.price === 0 || !product.thumbnail || !product.code) { // verifica que los valores no estén vacios o que el precio sea 0, el stock puede ser 0.
                 console.log(`Verificar ${product.code}, todos los parametros son obligatorio, excepto el stock puede ser 0`);
                    return false;
                    } else {
                        const checkproduct = await this.#checkCode(product.code) // verifica que el código no exita.
                        if (checkproduct==='OK') {
                            const newProduct = {
                                ...product,
                                id: await this.#getMaxID() + 1
                            }
                        
                                productsFile.push(newProduct);
                                await fs.promises.writeFile (this.path, JSON.stringify(productsFile));
                                console.log(`Producto ${product.code} creado`)
                                return `Producto ${product.code} creado`
                        } else {
                                console.log(`El producto ${product.code} ya existe`)
                                return `El prodcuto ${product.code} ya existe`}
                        }
                }
     
         catch (error) {
            console.log(error);
        }
    }


    async getProducts () {
        try {
            if (fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsJs = JSON.parse(products);
                return productsJs;
            } else {
                return [] //verificio si existe el archivo y si no existe devuelvo un array vacio
            }

        } catch (error) {
            console.log(error);
        }
        
    }

    async getProductsById(productId){
        try {
            const productsFile = await this.getProducts();
            const idProduct = productsFile.find(product => product.id === productId)
            if (idProduct) {
                console.log(`El producto con id ${productId} existe. mas detalle:`, idProduct)
                return idProduct
            } else {
                console.log(`Error al mostrar el producto, El producto con id ${productId} no existe`, idProduct)
                return idProduct
            }
        } catch (error) {
            console.log(error);
        }
    }

    async #getMaxID () { // busca el ultimo ID
        try {
            const productsFile = await this.getProducts();
            const ids = productsFile.map(product => product.id)
            if (ids.includes(1)) {
                return Math.max(...ids)
            } else {
                return 0}    
        } catch (error) {
            console.log(error);
        } 
        
    }

    async #checkCode(codeProduct){ // busca un codigo de producto y devuelve OK si no existe, y Error si existe.
        try {
            const productsFile = await this.getProducts();
            if (!productsFile.find(product => product.code === codeProduct)) {
                const estado = 'OK'
                return estado
            } else {
                const estado = 'Error'
                return estado
            }    
        } catch (error) {
            console.log(error);
        }
        
    }

    async updateProduct(product){//actualiza los productos
        try {
            const productsFile = await this.getProducts();
            const productId = product.id;
            const idPosition = productsFile.findIndex(product => product.id === productId);

            if(idPosition > -1){
                if(product.title!==''){productsFile[idPosition].title = product.title};
                if(product.description!==''){productsFile[idPosition].description = product.description};
                if(product.price>0){productsFile[idPosition].price = product.price}
                if(product.thumbnail!==''){productsFile[idPosition].thumbnail = product.thumbnail};
                if(product.code!==''){productsFile[idPosition].code = product.code};
                if(product.stock>0){productsFile[idPosition].stock = product.stock};

                await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
                console.log(`El producto ID ${productId} se actualizao`);
                return `El producto ID ${productId} se actualizao`;
            } else {
                console.log(`La actualizacion a fallado, el ID ${productId} no existe`);
                return `La actualizacion a fallado, el ID ${productId} no existe`
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(productId){
        try {
            const productsFile = await this.getProducts();
            const idPosition = productsFile.findIndex(product => product.id === productId);
            if(idPosition >-1){
                productsFile.splice(idPosition,1);
                await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
                console.log(`El Producto ID${productId} a sido borrado`);
                return `El Producto ID${productId} a sido borrado`
            } else {
                console.log(`la eleminacion del prodcuto a fallado, el ID${productId} no existe`);
                return `la eleminacion del prodcuto a fallado, el ID${productId} no existe`
            }
        } catch (error) {
            console.log(error);
        }
    }
}


const manager = new productManager('./products.json')
const product1 = {
    title:'Kit valvula',
    description:'Kit Valvula de presion minima',
    price:10000,
    thumbnail:'Sin imagen',
    code:'PT001',
    stock:0
}
const product2 = {// Error: codigo existente
    title:'Kit de montaje',
    description:'Kit de montaje de elementos',
    price:20000,
    thumbnail:'Sin imagen',
    code:'PT001',
    stock:5
}
const product3 = {
    title:'Kit de valvula',
    description:'Kit de valvula de retencion y cierre de aceite',
    price:16000,
    thumbnail:'Sin imagen',
    code:'PT002',
    stock:10
}
const product4 = {
    title:'Kit de reacondicionamiento',
    description:'Kit de reacondicionamiento del motor',
    price:29000,
    thumbnail:'Sin imagen',
    code:'PT003',
    stock:10
}
const product5 = {
    title:'Descargador',
    description:'Decargador de presion',
    price:5000,
    thumbnail:'Sin imagen',
    code:'PT004',
    stock:10
}
const product6 = {
    title:'Kit de linea',
    description:'Kit de linea de barrido',
    price:9000,
    thumbnail:'Sin imagen',
    code:'PT005',
    stock:10
}
const product7 = {//error de descripcion
    title:'Kit de filtro',
    description:'',
    price:9000,
    thumbnail:'Sin imagen',
    code:'PT006',
    stock:10
}
const product8 = {//error de precio
    title:'Piston',
    description:'Piston neumatico',
    price:0,
    thumbnail:'Sin imagen',
    code:'PT006',
    stock:10
}

const productUpdate1 = {
    id: 3,
    title: '',
    description: '',
    price: 8000,
    thumbnail: '',
    code: '',
    stock: ''  
}
const productUpdate2 = {
    id: 4,
    title: '',
    description: '',
    price: 6500,
    thumbnail: '',
    code: '',
    stock: ''
};

const test = async ()=> {
    console.log("complete la lista de producto: ", await manager.getProducts());
    await manager.addProduct(product1);
    await manager.addProduct(product2); 
    await manager.addProduct(product3);
    await manager.addProduct(product4);
    await manager.addProduct(product5);
    await manager.addProduct(product6);
    await manager.addProduct(product7); 
    await manager.addProduct(product8); 
    console.log("complete la lista de producto: ", await manager.getProducts());
   
    await manager.getProductById(3)
    await manager.getProductById(9) // Error: no existe el ID
    await manager.updateProduct(productUpdate1);
    await manager.updateProduct(productUpdate2);
    await manager.deleteProduct(4);
    await manager.deleteProduct(8);
    console.log("complete la lista de producto: ", await manager.getProducts());
}

test()

