import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputV2 from 'src/components/InputV2'
import { ErrorResponse, NoUndefinedField } from 'src/types/utils.type'
import { ProductSchema, productSchema, userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ObjectSchema } from 'yup'

type FormData = NoUndefinedField<ProductSchema>

export default function AddProduct() {
  const [file, setFile] = useState<File | null>(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
    control
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      rating: 0,
      price_before_discount: 0,
      quantity: 0,
      sold: 0,
      view: 0,
      image: '',
      images: ''
    },
    resolver: yupResolver<FormData>(productSchema as ObjectSchema<FormData>)
  })
  const updateProfileMutation = useMutation(productApi.addProduct)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData()
      formData.append('image', file as Blob)
      const uploadImageResult = await productApi.uploadImage(formData)
      const imageUrl = uploadImageResult.data.data as string
      console.log(data)
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        name: 'abc',
        category: '60afafe76ef5b902180aacb5',
        image: imageUrl,
        images: [imageUrl]
      })
      toast.success(res.data.message)
      // reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              // message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Thêm sản phẩm</h1>
      </div>
      <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='name'
                type='text'
                placeholder='Tên sản phẩm'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mô tả sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='description'
                type='text'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ảnh sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                name='image'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    className='relative w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    // register={register}
                    type='file'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFile(file)
                        field.onChange(file.name)
                      }
                    }}
                    // errorMessage={errors.name?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ảnh mô tả sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                name='images'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    className='relative w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    // register={register}
                    type='file'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // setFile(file)
                        field.onChange(file.name)
                      }
                    }}
                    // errorMessage={errors.name?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Giá sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='price'
                type='text'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.price?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Đánh giá sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='rating'
                type='text'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Giá sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='price_before_discount'
                type='text'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số lượng sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='quantity'
                type='text'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Đã bán</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='sold'
                type='text'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Lượt xem sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='view'
                type='text'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
