import type { NextPage } from 'next'
import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import { Button, useToast, useDisclosure, Select, } from '@chakra-ui/react'
import Modals from '../components/elements/Modals'
import Post from '../components/elements/Post'
import { ArrowForwardIcon, ArrowBackIcon, } from '@chakra-ui/icons'

const Home: NextPage = () => {
    const [posts, setPosts] = useState<any[]>([])
    const [status, setStatus] = useState(false)
    const [titleFilter, setTitleFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("none")
    const [dateFilter, setDateFilter] = useState("")
    const [page, setPage] = useState(1)
    const [disablePrevious, setDisablePrevious] = useState(true)
    const [disableNext, setDisableNext] = useState(false)
    var filteredList = useMemo(getFilteredList, [categoryFilter, posts, titleFilter, dateFilter]);

    const tokenStr = "5190ded1-549c-49d1-8cdf-c209d8d3803a"
    const { isOpen, onOpen, onClose } = useDisclosure()
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

    const getFromAPI = () => {
        axios.get(`https://oh-oprec-be.rorre.xyz/api/post/?page=${page}`, {
            headers: {
                Authorization: `Bearer ${tokenStr}`,
            }
        })

        .then((result) => {
            var data = result.data
            setPosts(data)
        })
        .catch((error) => {
            console.log(error)
        })

    }

    function postToAPI(category: any, title: any, image: any){
        const data = new FormData()
  
        data.append("category", category)
        data.append("title", title)
        data.append("image", image)
        
        axios.post("https://oh-oprec-be.rorre.xyz/api/post/", data, {
          headers:{
            Authorization: `Bearer ${tokenStr}`
          }
        })
  
        .then((result) => {
          console.log(result)
          setStatus(!status)
          showToast("Post Uploaded", "Post berhasil di upload!", "success", "top-center")
        })
  
        .catch((error) =>{
            showToast("Input Error / Server Error", "Input salah atau server tidak tersambung", "error", "top-center")
        })
    }

    const updateToAPI = (title: string, category: any, id: number, image: any = null) => {
        if(image === null){

            // Doesn't work ??

            // const data = new FormData()

            // data.append("category", category)
            // data.append("title", title)
            
            // axios.patch(`https://oh-oprec-be.rorre.xyz/api/post/${id}`, data, {
            //     headers:{
            //         Authorization: `Bearer ${tokenStr}`
            //     }
            // })

            let payload = {
                title: title,
                category: category,
            }

            const config = {
                method: "patch",
                url: `https://oh-oprec-be.rorre.xyz/api/post/${id}`,
                headers:{
                    Authorization: `Bearer ${tokenStr}`
                },
                data: payload,
            }
            
            axios(config)

            .then((result) => {
                setStatus(!status)
                showToast("Post Updated", "Post berhasil di update!", "success", "top-center")
            })

            .catch((error) => {
                showToast("Input Error / Server Error", "Input salah atau server tidak tersambung", "error", "top-center")
            })

        }else{

            let payload = {
                title: title,
                category: category,
                image: image,
            }
            console.log("Masuk dengan image")

            const config = {
                method: "patch",
                url: `https://oh-oprec-be.rorre.xyz/api/post/${id}`,
                headers:{
                    Authorization: `Bearer ${tokenStr}`
                },
                data: payload,
            }
            
            axios(config)

            .then((result) => {
                setStatus(!status)
                showToast("Post Updated", "Post berhasil di update!", "success", "top-center")
            })

            .catch((error) => {
                console.log(error)
                showToast("Input Error / Server Error", "Input salah atau server tidak tersambung", "error", "top-center")
            })
        }
    }
    const handleDeletePost = (id: Number) => {
        axios.delete(`https://oh-oprec-be.rorre.xyz/api/post/${id}`, {
            headers: {
                Authorization: `Bearer ${tokenStr}`
            }
        })
        .then((result) => {
            setStatus(!status)
            showToast("Post deleted", "Post sudah berhasil dihilangkan!", "success", "top-center")
        })
        .catch((error) => {
            showToast("Failed to delete", "Post tidak berhasil untuk dihilangkan!", "error", "top-center")
        })

    }

    function getFilteredList() {
        if (categoryFilter === "none" && titleFilter === "" && dateFilter === "") {
          return posts;
        }

        if(categoryFilter === "none" && dateFilter === ""){
            return posts.filter((post) => post.title.toLowerCase().includes(titleFilter.toLowerCase()))
        }

        if(titleFilter === "" && dateFilter === ""){
            return posts.filter((post) => post.category === categoryFilter)
        }

        if(categoryFilter === "none" && titleFilter === ""){
            return posts.filter((post) => new Date(post.uploaded_at).getTime() - new Date(dateFilter).getTime() + (14*60*60*1000) >= 0);
        }

        if(titleFilter === ""){
            return posts.filter((post) => post.category === categoryFilter).filter((post) => new Date(post.uploaded_at).getTime() - new Date(dateFilter).getTime() + (14*60*60*1000) >= 0)
        }

        if(categoryFilter === "none"){
            return posts.filter((post) => post.title.toLowerCase().includes(titleFilter.toLowerCase())).filter((post) => new Date(post.uploaded_at).getTime() - new Date(dateFilter).getTime() + (14*60*60*1000) >= 0)
        }

        if(dateFilter === ""){
            return posts.filter((post) => post.title.toLowerCase().includes(titleFilter.toLowerCase())).filter((post) => post.category === categoryFilter)
        }

        return posts.filter((post) => post.title.toLowerCase().includes(titleFilter.toLowerCase())).filter((post) => post.category === categoryFilter).filter((post) => new Date(post.uploaded_at).getTime() - new Date(dateFilter).getTime() + (14*60*60*1000) >= 0)
      }
    
    const previousAction = () => {
        setPage(page <= 1 ? 1 : page-1)
        setDisableNext(false)
        setStatus(!status)
    }

    const nextAction = () => {
        setPage(page + 1)
        setDisablePrevious(false)
        setStatus(!status)
    }

    useEffect(() => {
        if(page === 1){
            setDisablePrevious(true)
        }
        getFromAPI()
    }, [status])

    return (
        <div className = "font-bold">
            <div className = "mx-6 my-4 flex flex-col items-center">
                <h1 className = "text-3xl text-center text-[#fdfffe]"> Open Recruitement </h1> 
                <div className = "flex my-4 justify-center items-center gap-x-8 px-12 border-2 border-slate-200 md:flex-row flex-col md:py-8">
                    <h2 className = "text-white text-2xl mt-4 md:mt-0"> Filter: </h2>
                    <input value = {titleFilter} type = "text" className = "my-4 md:my-0 w-full rounded-md px-4 py-2 text-xs font-normal" placeholder='Masukkan kata yang ingin difilter' onChange={(e) => setTitleFilter(e.target.value)}/>
                    <Select defaultValue = "none" borderRadius="6px" className = "my-4 md:my-0 w-full text-xs my-4 text-white border-white" onChange = {(e) => setCategoryFilter(e.target.value)}>
                        <option disabled value = "none"> Category (Default: None) </option> 
                        <option className = "text-black" value = "none"> None </option> 
                        <option className = "text-black" value= "artwork"> Artwork </option>
                        <option className = "text-black" value= "anime"> Anime </option>
                        <option className = "text-black" value= "meme"> Meme </option>
                        <option className = "text-black" value= "photography"> Photography </option>
                        <option className = "text-black" value= "furry"> Furry </option>
                    </Select>
                    <input value = {dateFilter} onChange = {(e) => setDateFilter(e.target.value)} type = "date" className = "px-4 py-2 text-xs rounded-md w-full mt-4 mb-8 md:mt-0 md:mb-0"/>
                </div>

                <Button 
                    className = "my-4"
                    onClick={onOpen}
                    color = 'white' 
                    borderColor='#22c55e' 
                    bg = "#22c55e" 
                    variant='solid' 
                    borderRadius='6px' 
                    _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                    _active={{bg: '#22c55e', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
                > 
                    Upload Your Image Here! 
                </Button>

                <Modals isOpen = {isOpen} onClose = {onClose} tokenStr = {tokenStr} postToAPI = {(category:any, title:any, image:any) => postToAPI(category, title, image)}/>

                {filteredList.length >= 1 ?
                    <div className = "max-w-screen-xl w-full flex md:flex-row flex-col flex-wrap justify-center items-center">
                        {filteredList.map((post) => {
                            return <Post key = {post.id} category = {post.category} title = {post.title}
                            image = {`https://oh-oprec-be.rorre.xyz${post.url}`} uploaded_at = {post.uploaded_at} handleDeletePost = {() => handleDeletePost(post.id)} showToast = {(title: any, error: any, status:any, position: any) => showToast(title, error, status, position)} updateToAPI = {updateToAPI} id = {post.id}/>
                        })}
                    </div>
                 : 
                    (<div> 
                        <h1 className = "text-3xl my-16 font-bold text-white"> Nothing to show Here </h1> 
                    </div>)
                }
            </div>

            <div className = "flex justify-center items-center gap-4 mb-12">
                <Button 
                  leftIcon={<ArrowBackIcon />}  
                  _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                  color = '#22c55e' 
                  borderColor='#22c55e' 
                  variant='outline' 
                  borderRadius='6px' 
                  _active={{bg: 'none', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
                  onClick = {previousAction}
                  disabled = {disablePrevious}
                >
                  Sebelumnya
                </Button> 

                <p className = "text-white font-bold"> {page} </p>

                <Button 
                  rightIcon={<ArrowForwardIcon />} 
                  color = 'white' 
                  borderColor='#22c55e' 
                  bg = "#22c55e" 
                  variant='solid' 
                  borderRadius='6px' 
                  _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                  _active={{bg: '#22c55e', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
                  onClick = {nextAction}
                  disabled = {disableNext}
                >
                  Selanjutnya
                </Button>
            </div>

        </div>
    )

}

export default Home
