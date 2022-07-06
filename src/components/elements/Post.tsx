import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, Button, Input, Select, useToast, useDisclosure, } from '@chakra-ui/react'
import { useState, } from 'react'

const Post = (props:any) => {
    let hour, day
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [title, setTitle] = useState(props.title)
    const [image, setImage] = useState("")
    const [imagePreview, setImagePreview] = useState(props.image)
    const [category, setCategory] = useState(props.category)

    var trimmedString = props.title.substr(0, 16)

    if(props.title.length > trimmedString.length){ /* Apabila jumlah huruf > 21 maka akan ditambahkan ... */
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + " ..."
    }else{ /* Apabila lebih kecil dari 21 maka title nya akan seperti itu*/
        trimmedString = props.title
    }

    var timeHour = (parseInt(props.uploaded_at.substring(11, 13)) + 7)
    var timeDay = parseInt(props.uploaded_at.substring(8, 10))

    if(timeHour >= 24){
      timeHour -= 24
      timeDay += 1
      if(timeHour < 10){
          hour = "0" + timeHour.toString()
      }else{
          hour = timeHour.toString()
      }
      if(timeDay < 10){
        day = "0" + timeDay.toString()
      }else{
        day = timeDay.toString()
      }
    }else{
      if(timeHour < 10){
          hour = "0" + timeHour.toString()
          day = "0" + timeDay.toString()
      }else{
          hour = timeHour.toString()
          day = timeDay.toString()
      }
  
      if(timeDay < 10){
        day = "0" + timeDay.toString()
      }else{
        day = timeDay.toString()
      }
    }
    
    const createdTimeStamp = props.uploaded_at.substring(0, 8) + day + " at "+ hour + props.uploaded_at.substring(13, 16) + props.uploaded_at.substring(16, 19) + " WIB "

    
    const handleImageUpload = (e: any) => {
      try{
        setImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]))
      } catch(error){
        setImagePreview("https://icons.veryicon.com/png/o/education-technology/alibaba-cloud-iot-business-department/image-load-failed.png")
      }
    }

    const handleUpdate = () => {
      if(title === "" || category === ""){
        props.showToast("Invalid Input", "Ada input yang belum terisi", "error", "top-center")
      }else{  
        if(image === ""){
          props.updateToAPI(title, category, props.id)
        }else{
          props.showToast("Tidak bisa update Image", "Server tidak mendukung untuk mengganti image", "error", "top-center")
          setImagePreview(props.image)
          setImage("")
        }
      }
    }

    return (
      <>
        <div className="mx-8 my-12 hover:scale-105 duration-100 flex">
            <div className="flex bg-white border border-gray-300 rounded-xl md:flex-row flex-col overflow-hidden items-center justify-start">                     
                <div className="relative w-64 h-64 md:w-32 md:h-32 flex-shrink-0">                      
                    <div className="absolute left-0 top-0 w-full h-full block">                                    
                        <img className = "w-full block max-w-full h-full object-cover" alt = "gambar" src = {props.image}/>
                    </div>
                </div>
                                        
              <div className="px-4 flex flex-col md:mt-0 mt-2 md:text-left text-center">                         
                  <p className="text-xl capitalize text-ellipsis"> {trimmedString} </p>                          
                  <p className="text-xs text-green-500"> {createdTimeStamp} </p>
                  <p className = "capitalize text-red-500 text-xs"> {props.category} </p>
                  <div className = "flex mt-4 justify-evenly">
                    <div className = "flex flex-col items-center">
                      <EditIcon _hover={{ color: "#48BB78"}} color= "green" className = "cursor-pointer mb-1 duration-700" onClick={onOpen}/>
                      <p className = "text-xs"> Edit </p> 
                    </div>
                    <div className = "flex flex-col items-center justify-center md:mb-0 mb-4">
                      <DeleteIcon _hover={{ color: "#F56565"}} onClick = {props.handleDeletePost} color= "red" className = "cursor-pointer mb-1 duration-700"/>
                      <p className = "text-xs"> Delete </p> 
                    </div>
                  </div>             
              </div>
            </div>
        </div>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader> Update Post </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div className = "flex flex-col">
                  <label className = "font-bold"> Post's Title </label>
                  <Input value = {title} className = "my-4" placeholder = "Masukkan judul gambar..." onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className = "flex flex-col">
                  <label className = "font-bold"> Post's Image </label>
                  <img alt = "gambar" src = {imagePreview} />
                  <input className = "my-4" type = "file" accept="image/*" onChange = {handleImageUpload}/>
                </div>
                <div className = "flex flex-col">
                  <label className = "font-bold"> Post's Category </label>
                  <Select value = {category} borderRadius="6px" className = "my-4" onChange = {(e) => setCategory(e.target.value)}>
                    <option disabled value = "default"> Category (Default: Artwork) </option> 
                    <option className = "text-black" value= "artwork"> Artwork </option>
                    <option className = "text-black" value= "anime"> Anime </option>
                    <option className = "text-black" value= "meme"> Meme </option>
                    <option className = "text-black" value= "photography"> Photography </option>
                    <option className = "text-black" value= "furry"> Furry </option>
                  </Select>
                </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color = 'white' 
                variant='solid' 
                borderRadius='6px' 
                borderColor='#22c55e' 
                bg = "#22c55e"
                mr={3} 
                onClick={handleUpdate}
                _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)'}} 
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default Post