'use server'
import {redirect as redirect_} from 'next/navigation'

export const redirect = async url => redirect_(url)
