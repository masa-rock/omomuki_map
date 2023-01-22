class Api::V1::PostsController < ApplicationController
  def index
    @posts = Post.search_keyword_and_tag(params[:keyword], params[:tags]).includes([:review, :tags]).with_attached_images
    counter = @posts.size
    render json: {"posts" => @posts}, include: [:review, :tags], methods: [:image_url]
  end

  def show
    post = Post.find(params[:id])
    render json: { 'post' => post }, include: %i[review tags want_to_goes], methods: [:image_url]
  end

  def create
    post = Post.new(post_params)
    error_message = ''
    if Post.where(name: params[:name], address: params[:address]).count >= 1
      error_message = 'スポット名もしくは住所はすでに登録されています。'
      render json: { 'post' => post, 'error_message' => error_message }, methods: [:image_url] and return
    end
    if params[:images][:name] != ''
      blob = ActiveStorage::Blob.create_and_upload!(
        io: StringIO.new(decode(params[:images][:data])),
        filename: params[:images][:name]
      )
      post.images.attach(blob)
    end
    post.save
    render json: { 'post' => post, 'error_message' => error_message }
  end

  def destroy
    post = Post.find(params[:id])
    tag_posts = TagPost.where(post_id: post.id)
    tag_posts.map(&:destroy)
    post.destroy
  end

  def post_review
    reviews = Review.includes(:post).where(post: { id: params[:id] })
    render json: reviews, include: [:user], methods: [:image_url]
  end

  def assessment
    @posts = Post.includes(:review).with_attached_images.all.each do |post|
      post.average = post.average_score
    end

    posts = @posts.sort_by{ |post| -post.average }[0, 5]
    render json: posts, include: [:review], methods: [:image_url]
  end

  private

  def post_params
    params.permit(:name, :address, :business_hours_start, :business_hours_end, :fee, :eat_walk, :stay_time, :description, :lat, :lng, tag_ids: [])
  end

  def decode(str)
    Base64.decode64(str.split(',').last)
  end
end
