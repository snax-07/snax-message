'use client'
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

function Page() {

  type message = Message & {
    _id: string;
  }

    const [message , setMessages] = useState<Array<Message & { _id: string }>>([])
    const [isLoading , setIsLoading] = useState(false);
    const [isSwitchLoading , setIsSwitchLoading] = useState(false)
    const {toast} = useToast()

    const handleDeleteMessage = (messageId: string)  => {
      // Filter out the message with the given ID
      setMessages(prevMessages => prevMessages.filter(message => message._id !== messageId));
    };
    

    const {data: session} = useSession();
    const form = useForm({
        resolver : zodResolver(acceptMessageSchema),
         defaultValues : {
          acceptMessage : true
         }
    });

    
    const {register , watch , setValue} = form;

    const acceptMessage = watch('acceptMessage');  

    const  fetchAcceptMessage = useCallback(async ()=>{ 
            setIsSwitchLoading(true)
            try {
                const response = await axios.get<ApiResponse>('/api/accept-messages')
                setValue('acceptMessage' , response.data.isAcceptingMessage ?? false)
            } catch (error) {
                const axiosError =  error as AxiosError<ApiResponse>
                toast({
                    title : "Error",
                    description : axiosError.response?.data?.message,

                    variant : "destructive"
                })
            }finally{
                setIsSwitchLoading(false)

            }
    } , [setValue,toast])

    const fetchMessages = useCallback(
      async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
          const response = await axios.get<ApiResponse>('/api/get-messages');
          setMessages(response.data.messages || []);
          if (refresh) {
            toast({
              title: 'Refreshed Messages',
              description: 'Showing latest messages',
            });
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ?? 'Failed to fetch messages',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
          setIsSwitchLoading(false);
        }
      },
      [setIsLoading, setMessages, toast]
    );
  
    useEffect(() => {
        if(!session || !session.user) return;
        fetchAcceptMessage()
        fetchMessages()
    } , [session,setValue,fetchAcceptMessage , fetchMessages , toast])

    //HANDLING SWITCH CHANGE
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages' , {acceptMessage : !acceptMessage})
            setValue('acceptMessage' , !acceptMessage)
            toast({
                title : response.data?.message,
                variant : "default"
            })
        } catch (error) {
            const axiosError =  error as AxiosError<ApiResponse>
            toast({
                title : "Error",
                description : axiosError.response?.data?.message,

                variant : "destructive"
            })
        }
    }

    const username = session?.user?.username;
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title : "URL Copied",
            description : "Pofile url has been copied to clipboard"
        })
    }

    if(!session || !session.user){
        return <div>
            please login
        </div>
    }
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">{username} Dashboard</h1>
    
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
    
          <div className="mb-4">
            <Switch
              {...register('acceptMessage')}
              checked={acceptMessage}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessage ? 'On' : 'Off'}
            </span>
          </div>
          <Separator />
    
          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {message.length === 0 ? (
        <p>No messages available.</p>
      ) : (
        <ul>
          {message.map((message: message) => (
            <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
          ))}
          </ul>
      )}
         </div> 
        </div>
      );
}

export default Page
