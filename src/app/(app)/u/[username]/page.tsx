'use client'

import { useForm, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";

export default function UserPage({ params }: { params: { username: string } }) {
    const { username } = React.use(params);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: FieldValues) => {
       try {
            const response = await axios.post('/api/send-message' , {username , content : data.inputField})
            toast({
                title : "Message INFO",
                description : response.data?.message
            })
       } catch (error) {
           const axiosError = error as AxiosError
         toast({
            title : "Error while sending message",
            description : axiosError.message
         })
       }
    };
  
    return (
      <div>
        <h1>Welcome, {username}!</h1>
        <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4"
      >
        <Input
          {...register("inputField", { required: true })}
          type="text"
          placeholder="Enter text"
          className="w-full"
        />
        <Button type="submit" className="px-6">
          Submit
        </Button>
      </form>
    </div>
      </div>
    );
  }
  