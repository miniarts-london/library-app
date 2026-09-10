 'use client'

import { styled, useTheme } from '@mui/material/styles'
import { List, ListItem, Link, Chip, Box, Alert, Typography, IconButton } from '@mui/material'
import { useUserInfo } from '../../components/ContextRoot'
import logo from '../../../../public/brand/logo-menu.svg'
import MuiDrawer from '@mui/material/Drawer'
import { Theme, CSSObject } from '@mui/material/styles'
import logoSml from '../../../../public/brand/logo-sml.svg'
import MultiMenu from './MultiLevelMenu'
import classroom from '../../../../public/img-team.png'
import Image from 'next/image'
import { drawerWidth, drawerWidthClosed } from '../../../config/config'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
})

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    overflowY: 'hidden',
    width: drawerWidthClosed,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '& .MuiListItemButton-root': {
      justifyContent: 'center',
      px: 1,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      justifyContent: 'center',
    },
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
            backgroundColor: '#F5F5FD',
            border: 'none',
        },
        variants: [
        {
            props: ({ open }) => open,
            style: {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
            },
        },
        ],
    }),
)

export function SideMenu({open, handleDrawerOpen}: {open: boolean, handleDrawerOpen: ()=>void}){
    const { forename, surname, roles, initials } = useUserInfo()
    const userRoleNames = roles?.filter(item=>item.name !== null).map(item=>item.name)
    const userRole = userRoleNames[userRoleNames?.length-1]
    const theme = useTheme()
    return(
        <>
            <Drawer
                variant='permanent'
                open={open}
            >
                <Box sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    <DrawerHeader>
                        <Box sx={[
                             !open && { display: 'none' },
                             {
                                border: `1px solid ${theme.palette.grey[300]}`,
                                padding: '7px 10px 0',
                                borderRadius: 1,
                                backgroundColor: 'white',
                                width: '100%',
                                textAlign: 'center',
                            }]}>
                            <Link href="./">
                                <Box sx={[
                                    !open && { display: 'none' }
                                ]}>
                                    <Image
                                        src={logo.src}
                                        alt="SENshine"
                                        loading="lazy"
                                        width={190}
                                        height={30}
                                        style={{
                                            height: 'auto',
                                            width:'80%',
                                        }}
                                    />
                                </Box> 
                            </Link>
                        </Box>
                        <Box sx={[
                            open && { display: 'none' },
                            {
                                padding: '5px',
                            }]}
                        >
                            <Link href="./">
                                <Box>
                                    <Image
                                        src={logoSml.src}
                                        alt="SENshine"
                                        loading="lazy"
                                        width={43}
                                        height={31}
                                        style={{
                                            height: 'auto',
                                            marginTop: '10px'
                                        }}
                                    />
                                </Box>
                            </Link>
                        </Box>
                    </DrawerHeader>
                
                    <List sx={{paddingTop: 0}}>
                        <MultiMenu menuOpen={open}/>
                    </List>

                    {open&&<Alert severity='warning' sx={{
                        'textWrap':'auto', 
                        marginTop: '1em',
                        fontSize:'.65em'}}>
                        For your security, if you leave your computer for more than 30 mins, 
                        you may be asked to re-log in. To avoid losing work, 
                        please save anything inputted before you step away.
                    </Alert>}
              
                    {open && <List sx={[
                        { 
                            width: '90%',
                            textAlign: 'center',
                            margin: '5%',
                            backgroundColor: '#f0eff3',
                            paddingTop: '15px',
                            '> *': {
                                'justifyContent': 'center'
                            },
                        }
                    ]}>
                        <ListItem sx={{justifyContent:'center'}}>
                            <Typography variant='h3'>{forename} {surname}</Typography>
                        </ListItem>
                        <ListItem disablePadding>
                            {userRole && <Chip label={userRole} variant="outlined" size="small" color="primary"/>}
                        </ListItem>
                        <ListItem>
                            <Image
                                src={classroom.src}
                                alt=""
                                loading="lazy"
                                width={224}
                                height={143}
                                style={{
                                    height: 'auto',
                                    width: '100%',
                                }}
                            />
                        </ListItem>
                    </List>}
                </Box>

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ 
                        border: '1px solid #7953D4', 
                        backgroundColor: `${theme.palette.primary.light} !important`,
                        borderRadius: 1,
                        display:'flex',
                        flexDirection: open?'row':'column',
                        color: theme.palette.primary.main,
                        margin: '8px 4px 10px',
                        position: 'relative',
                        flexShrink: 0,
                        width: open ? 'calc(100% - 8px)' : '90%',
                        alignSelf: 'center',
                    }}
                >
                    {open?<>
                        <MenuOpenIcon color='primary'/>
                        <Typography variant='caption' sx={{marginLeft:'10px'}}>Collapse menu</Typography>
                    </>: <>
                        <MenuIcon color='primary'/>
                        <Typography variant='caption'>Expand</Typography>
                    </>}
                </IconButton>
            </Drawer>
        </>
    )
}