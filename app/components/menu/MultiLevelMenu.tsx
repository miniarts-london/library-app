import React, { useEffect, useState } from "react"
import { useTheme } from '@mui/material/styles'
import { Divider, ListItem, List, ListItemButton, Collapse, Tooltip, IconButton, Popover, Paper, Typography } from "@mui/material"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Menu } from "./Menu"
import { hasChildren } from "./Utils"

export default function MultiMenu({menuOpen=true, preload}: {menuOpen?:boolean, preload?: boolean}) {
    const [path, setPath] = useState('')
    useEffect(()=>{
        setPath(window.location.pathname)
    },[])

    return Menu.map((item: any, key: any) => <MenuItem key={key} item={item} path={path} menuOpen={menuOpen} />)
}

const MenuItem = ({ item, topLevel = true, path, menuOpen }: {item:any, topLevel?: boolean, path?:string, menuOpen:boolean}) => {
    const theme = useTheme()
    const Component = hasChildren(item) ? MultiLevel : SingleLevel
 
    const active = path?.includes(item.id)

    return <Component item={item} theme={theme} active={active} topLevel={topLevel} path={path} menuOpen={menuOpen} />
}

const SingleLevel = ({ item, theme, active, topLevel, path, menuOpen }: any) => {
    return (
        <ListItem disablePadding >
            <ListItemButton 
                component="a" 
                href={item.link} 
                sx={{
                    background: (active && topLevel)?'#fff':'',
                    border: (active && topLevel)?`1px solid ${theme.palette.grey[300]}`:'none',
                    borderRadius: '3px',
                    paddingLeft: menuOpen
                      ? ((active && topLevel) ? '20px' : '21px')
                      : '8px',
                    justifyContent: menuOpen ? 'flex-start' : 'center',
                    '&:hover': {
                        background: topLevel?'':menuOpen?'#ebebf3':'transparent',
                    }
                }}
            >
                {menuOpen ? <>
                    {item.icon &&
                        <ListItemIcon sx={{
                                        color: theme.palette.primary.main, 
                                        minWidth:'44px',
                                    }}
                        >
                            {item.icon}
                        </ListItemIcon>
                    }
                    <ListItemText 
                        primary={item.title} 
                        sx={{
                            color: active?theme.palette.primary.main:theme.palette.grey.main, 
                            marginLeft: topLevel?0:'10px',
                        }}
                    />
                </>:
                <Tooltip title={item.title}>
                    {item.icon ? (
                        <ListItemIcon sx={{
                                        color: theme.palette.primary.main, 
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    }}
                        >
                            {item.icon}
                        </ListItemIcon>
                    ) : (
                        <IconButton size="small" sx={{
                            width:30, 
                            height:30, 
                            backgroundColor:'#ecebebff', 
                            fontSize:'.9em',
                            color: theme.palette.primary.main, 
                            '&:hover': {backgroundColor:'#e0e0e0'}
                        }}>
                            {item.title.charAt(0)}
                        </IconButton>
                    )}
                </Tooltip>
                }
            </ListItemButton>
        </ListItem>
    )
}

const MultiLevel = ({ item, theme, active, topLevel, path, menuOpen }: any) => {
  const { items: children } = item
  const [open, setOpen] = useState(active)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const popupOpen = Boolean(anchorEl)

  useEffect(() => {
    setOpen(active)
  }, [active])

  useEffect(() => {
    if (menuOpen) setAnchorEl(null)
  }, [menuOpen])
  
  const handleClick = () => {
    setOpen((prev:boolean) => !prev)
  }

  const handleCollapsedClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopup = () => {
    setAnchorEl(null)
  }

  const handleOpenPage = (link: string) => { 
    link && (window.location.href = link)
  }

  return (
    <>
        <Divider variant="middle" />
        
        <ListItem disablePadding >
            <ListItemButton 
                onClick={menuOpen ? handleClick : handleCollapsedClick}
                sx={{
                    color: theme.palette.primary.main, 
                    margin: '3px 3px 0',
                    background: active || popupOpen ? '#fff' : '',
                    border: (active || popupOpen) ? `1px solid ${theme.palette.grey[300]}`:'none',
                    borderRadius: '3px',
                    paddingLeft: menuOpen ? '18px' : '8px',
                    justifyContent: menuOpen ? 'flex-start' : 'center',
                    whiteSpace: 'normal',
                }}
            >
                {menuOpen ? <>
                    <ListItemIcon sx={{color: theme.palette.primary.main, minWidth:'44px'}} >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} sx={{color: theme.palette.grey.main}} onClick={() => handleOpenPage(item.link)}/>
                    <span >
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </span>
                </> :
                <Tooltip title={popupOpen ? '' : item.title}>
                    <ListItemIcon sx={{
                        color: theme.palette.primary.main,
                        minWidth: 0,
                        justifyContent: 'center',
                    }}>
                        {item.icon}
                    </ListItemIcon>
                </Tooltip>
                }
            </ListItemButton>
        </ListItem>

        <Popover
            open={popupOpen && !menuOpen}
            anchorEl={anchorEl}
            onClose={handleClosePopup}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
                paper: {
                    sx: {
                        ml: 1,
                        minWidth: 220,
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.grey[300]}`,
                        boxShadow: 3,
                    },
                },
            }}
        >
            <Paper elevation={0} sx={{ backgroundColor: '#F5F5FD' }}>
                <Typography
                    variant="subtitle2"
                    sx={{ px: 2, pt: 1.5, pb: 0.5, color: theme.palette.primary.main }}
                >
                    {item.title}
                </Typography>
                <List disablePadding sx={{ py: 0.5 }}>
                    {children.map((child: any, key: any) => {
                        const childActive = path?.includes(child.id)
                        return (
                            <ListItem key={key} disablePadding>
                                <ListItemButton
                                    component="a"
                                    href={child.link}
                                    onClick={handleClosePopup}
                                    sx={{
                                        px: 2,
                                        py: 0.75,
                                        backgroundColor: childActive ? '#fff' : 'transparent',
                                        '&:hover': { backgroundColor: '#ebebf3' },
                                    }}
                                >
                                    <ListItemText
                                        primary={child.title}
                                        sx={{
                                            color: childActive
                                                ? theme.palette.primary.main
                                                : theme.palette.grey.main,
                                            '& .MuiTypography-root': { fontSize: '0.9rem' },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Paper>
        </Popover>

        <Collapse in={open && menuOpen} timeout="auto" unmountOnExit>
            <ListItemButton 
                sx={{
                    color: theme.palette.primary.main, 
                    margin: '-3px 3px 0',
                    overflow: 'hidden',
                    background: active?'#fff':'',
                    border: active?`1px solid ${theme.palette.grey[300]}`:'none',
                    borderTop: 'none',
                    borderRadius: '0 0 3px 3px',
                    padding: 0,
                    '&:hover':{
                        backgroundColor: active?'#fff':'transparent !important'
                    }
                }}
            >
                <List 
                    component="div" 
                    disablePadding 
                    sx={{
                        width:'100%',
                        marginLeft: menuOpen ? '29px' : '0', 
                        marginBottom: '10px',
                        borderLeft: menuOpen ? `1px solid ${theme.palette.primary.main}` : 'none',
                        whiteSpace: 'normal',
                        '& > li > a ': {
                            padding: '5px 16px 5px 4px',
                             '&> div > span ': {
                                fontSize: '0.9rem !important',
                            },
                        },
                        paddingLeft:'10px', 
                    }}
                >
                    {children.map((child: any, key: any) => ( 
                        <MenuItem key={key} item={child} topLevel={false} path={path} menuOpen={menuOpen}/>
                    ))}
                </List>
            </ListItemButton>
        </Collapse>
    </>
  )
}
