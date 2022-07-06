import { Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, Button, Input, Select, useToast} from '@chakra-ui/react'
import axios from 'axios'
import { useState, } from 'react'

const Modals = (props: any) => {
    const [category, setCategory] = useState("default")
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [imagePreview, setImagePreview] = useState(props.image)
    const toast = useToast()

    const showToast = (title: any, error: any, status: any, position: any) => {
      toast({
        title: title,
        description: error,
        status: status,
        duration: 5000,
        isClosable: true,
        position: position,
      })
    }

    const handleSubmit = () => {
      if(category === "default" || title === "" || image === ""){
        showToast("Invalid Input", "Ada input yang belum terisi", "error", "top-center")
      }else{
        try{
          props.postToAPI(category, title, image)
          setCategory("default")
          setTitle("")
          setImage("")
          setImagePreview("")
        } catch(error){
          console.log(error)
        }
      }
    }

    const handleImageUpload = (e: any) => {
      try{
        setImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]))
      } catch(error){
        setImagePreview("https://icons.veryicon.com/png/o/education-technology/alibaba-cloud-iot-business-department/image-load-failed.png")
      }
    }

    return(
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Upload Post </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <div className = "flex flex-col">
                <label className = "font-bold"> Post's Title </label>
                <Input className = "my-4" placeholder = "Masukkan judul gambar..." value = {title} onChange={(e) => setTitle(e.target.value)}/>
              </div>
              <div className = "flex flex-col">
                <label className = "font-bold"> Post's Image </label>
                {imagePreview && <img src = {imagePreview} alt = "gambar"/>}
                <input className = "my-4" type = "file" accept="image/jpeg, image/png" onChange = {handleImageUpload}/>
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
              onClick={handleSubmit}
              _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)'}} 
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default Modals