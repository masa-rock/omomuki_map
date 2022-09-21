class Api::V1::PostsController < ApplicationController
  def index
    if not params[:keyword] == "" || params[:keyword].nil?
      if params[:tags]
        tag_params = params[:tags].map{|n| n.to_i}
        posts = Post.includes(:tags).where("posts.name Like ?","%#{params[:keyword]}%").or(Post.where("description Like ?", "%#{params[:keyword]}%")).or(Post.includes(:tags).where(tags:{id:tag_params}))
        tags = Tag.where(id:tag_params)
        tag_name = tags.map{|t| t.name}
      else
        posts = Post.where("name Like ?","%#{params[:keyword]}%").or(Post.where("description Like ?", "%#{params[:keyword]}%"))
      end
    elsif not params[:tags].nil?        
        tag_params = params[:tags].map{|n| n.to_i}
        posts = Post.includes(:tags).where(tags:{id: tag_params})
        tags = Tag.where(id:tag_params)
        tag_name = tags.map{|t| t.name}
    else
      posts = Post.all
    end
    counter = posts.size

    render json: {"posts" => posts, "counter" => counter, "keyword" => params[:keyword], "tags" => tag_name }, methods: [:image_url]
  end

  def show
    post = Post.find(params[:id])
    # tag_names = post.tags.map{|t| t.name}
    post_reviews = Review.includes(:post).where(post:{id: post.id})
    
    total_reviews = post_reviews.sum{|hash| hash[:rate]}

    # render json: {"post" => post, "tag_names" => tag_names, "reviews_count" => reviews_count, "average_reviews" => average_reviews }, methods: [:image_url]
    render json: {"post" => post}, include: [:review, :tags], methods: [:image_url]
  end

  def create
    post = Post.new(post_params)
    if not params[:images][:name] == ""
      blob = ActiveStorage::Blob.create_and_upload!(
        io: StringIO.new(decode(params[:images][:data]) + "\n"),
        filename: params[:images][:name]
      )
      post.images.attach(blob)
      post.save
      render json: post, methods: [:image_url]
    else
      post.save
      render json: post, methods: [:image_url]
    end
  end

  def destroy
    post = Post.find(params[:id])
    tag_posts = TagPost.where(post_id: post.id)
    tag_posts.each do |tp|
      tp.destroy
    end
    post.destroy
  end

  def post_review
    post = Post.find(params[:id])
    reviews = Review.includes(:post).where(post: {id: params[:id]})
    render json: reviews, include: [:user], methods: [:image_url]
  end

  private
  def post_params
    params.permit(:name, :address, :business_hours_start, :business_hours_end, :fee, :eat_walk, :stay_time, :description, :lat, :lng, tag_ids: [])
  end

  def decode(str)
    Base64.decode64(str.split(',').last)
  end
end
