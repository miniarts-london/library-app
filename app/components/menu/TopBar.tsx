'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useClassInfo, useStudentInfo, useUserInfo } from '../../components/ContextRoot'
import { styled, lighten, darken, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { IconButton, Box, Avatar, Toolbar, TextField, MenuItem, InputLabel, FormControl } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import ComboBox from '../autoComplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { drawerWidth, drawerWidthClosed } from '../../../config/config'
import { MenuProfile } from "./Menu"
import classroom from '../../../../public/img-team.png'
import Image from 'next/image'

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 33,
    border: `1px solid ${theme.palette.primary.main}`, 
    backgroundColor: 'white',
    '&:hover': {
        backgroundColor: 'white',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledTextfield = styled(TextField)(({ theme }) => ({
    paddingLeft: '40px',
    width: '100%',
    
    '& fieldset' : {
        border: 'none !important',
        color: theme.palette.primary.main,
        
    },
    '& .MuiInputBase-root': {
        padding: '0 0 1px',
        minWidth: '130px',
    },
    '& .MuiInputBase-input': {
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '9ch',
            '&:focus': {
                width: '26ch',
            },
        },
    },
}))

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
}))
  
const GroupItems = styled('ul')({
    padding: 0,
})

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    left: drawerWidthClosed,
    color: theme.palette.primary.main,
    width: `calc(100% - ${drawerWidthClosed}px)`,
    paddingTop: '6px',
    borderBottom: `1px solid ${theme.palette.grey[300]}`, 
    transition: theme.transitions.create(['left', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => !!open,
        style: {
          left: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['left', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
}))

export function TopBar ({open}: {open?: boolean}){
    const [profile, setProfile] = useState(MenuProfile[0].id)
    const { forename, email, image } = useUserInfo()
    const studentData = useStudentInfo()
    const classData = useClassInfo()
    const theme = useTheme()
    const profilePhoto = image
    // console.log('studentData', studentData)
    useEffect(()=>{
        const path = window.location.pathname.replace('/','')
        MenuProfile.forEach((item: any) => {
            if(item.id === path){
                setProfile(path)
            }else{
                setProfile(MenuProfile[0].id)
            }
        })
    },[])

    const allData = useMemo(() => {
        const students = studentData?.map((item: any) => {
            return {
                name: `${item.firstName} ${item.lastName}`,
                id: item.id,
                category: 'student',
            }
        }) || []
        const classes = classData?.map((item: any) => {
            return {
                name: `${item.subject} (${item.name})`,
                id: item.id,
                category: 'class',
            }
        }) || []

        return [...students, ...classes]
    },
    [studentData, classData]
)

    const handleChange = (event: SelectChangeEvent) => {
        setProfile(event.target.value as string)
    }

    const handleClickAlert = () => {
        window.location.href = '/alert'
    }

    const handleClickProfile = (link: string) => {
        window.location.href = link
    }

    //autocomplete
    const options = allData?.map((option) => {
        const firstLetter = option.name[0].toUpperCase()
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        }
    })

    const handleSelect = (val: any, option: any) =>{
        const path = option.category === 'class'?'classes': 'pupils'
        if(!option.id) return
        window.location.href = `${window.location.origin}/${path}/details?id=${option.id}`
    }

    const defaultProps = {
        freeSolo: true,
        options: options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)),
        groupBy: (option:any) => option.firstLetter,
        getOptionLabel: (option: any) => option.name || '',
        renderInput: (params: any) => 
            <StyledTextfield 
                {...params} 
                placeholder="Search for learners or classes" 
            /> ,
        renderGroup: (params: any) => (
            <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
            </li>
        ),
        onChange:(e: any, option: any)=>handleSelect(e, option),
        renderOption:(props: any, option: any, { inputValue }: { inputValue: any }) => {
            const { key, ...optionProps } = props
            const matches = match(option.name, inputValue, { insideWords: true })
            const parts = parse(option.name, matches)
    
            return (
              <li key={key} {...optionProps}>
                { option.category === 'student'?<Person2OutlinedIcon/>:<CoPresentOutlinedIcon/>}
                <div style={{paddingLeft: '15px'}}>
                  {parts.map((part: any, index: number) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            )
          }
    }

    return(
        <AppBar 
            position="fixed" 
            open={open} 
            elevation={0}
        >
            <Toolbar sx={{
                borderTop: `1px solid ${theme.palette.grey[300]}`,
                borderLeft: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: '10px 0 0 0'
            }}>

                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <ComboBox options={defaultProps}/>
                </Search>

                <Box sx={{ flexGrow: 1,  height: '60px', overflow:'hidden', position: 'relative' }}>
                    <Image
                        src={classroom.src}
                        alt={'Team'}
                        loading="eager"
                        width={640}
                        height={432}
                        style={{
                            width: '250px',
                            height: 'auto',
                            position: 'absolute',
                            right: '-20px',
                            top: '-10px'
                        }}
                    />
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Box>
                        <FormControl fullWidth size="small" 
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: '1px solid #7953D4',
                                },
                                marginRight: '20px',
                            }}>
                            {/* <InputLabel></InputLabel> */}
                            <Select
                                labelId="select-label"
                                id="select"
                                value={profile}
                                onChange={handleChange}
                                renderValue={(value) => {
                                    return (
                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        <Avatar
                                            src={`data:profilePhoto/pngbase64, ${profilePhoto}`}
                                            alt={`${forename}`}
                                            sx={{
                                                height: '30px',
                                                width: '30px',
                                                borderRadius: '50%',

                                            }}
                                        />
                                        {value}
                                      </Box>
                                    )
                                }}
                                sx={{
                                    padding:0,
                                    width:'200px',
                                    textTransform: 'capitalize',
                                    color: theme.palette.primary.main,
                                    '&>#select':{
                                        padding:'6px 10px',
                                        '&>*':{
                                            alignItems: 'center'
                                        },
                                        
                                    },
                                    '& fieldset': { borderRadius: 33, },
                                    backgroundColor: 'white',
                                    borderRadius: 33,
                                }}
                                
                            >
                                {
                                    MenuProfile.map((item: any, i: number)=>{
                                        return(
                                            <MenuItem key={i} value={item.id} onClick={()=>handleClickProfile(item.link)} >{item.title}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            sx={[
                                {
                                    mr: 2,
                                },
                                { 
                                    border: '1px solid #7953D4', 
                                    borderRadius: 1
                                }
                                
                            ]}
                            onClick={handleClickAlert}
                        >
                            <NotificationsNoneIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}