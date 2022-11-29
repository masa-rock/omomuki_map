module AuthenticaitionHelper
  HTTP_HELPERS_TO_OVERRIDE = [:get, :post, :patch, :put, :delete]

  # ログイン状態にする
  def login(user)
    @user = user
    @auth_token = @user.create_new_auth_token # devise_token_authのメソッド 参考: https://www.rubydoc.info/gems/devise_token_auth/0.1.37/DeviseTokenAuth%2FConcerns%2FUser:create_new_auth_token
  end

  # ログアウトする
  def logout
    @user = nil
    @auth_token = nil
  end

  # 参考: https://gist.github.com/blaze182/3a59a6af8c6a7aaff7bf5f8078a5f2b6
  HTTP_HELPERS_TO_OVERRIDE.each do |helper| # 定数に対して繰り返し処理を実行
    define_method(helper) do |path, **args| # def get(path) のようなメソッドを動的に定義 
      add_auth_headers(args) # privateメソッドの呼び出し
      args == {} ? super(path) : super(path, **args) # argumentsが空ハッシュなら定義元のメソッドを実行、空でなければ定義元のメソッドをargumentsを引き連れて実行
    end
  end

  private
   # tokenをセットするprivateメソッド
    def add_auth_headers(args)
      return unless defined? @auth_token # @auth_tokenが定義されていなければ処理終了 https://www.xmisao.com/2014/03/30/checking-if-a-variable-is-defined.html
      args[:headers] ||= {} # args[:headers]がnilなら{}を代入
      args[:headers].merge!(@auth_token) # args[:headers]に@auth_tokenを代入
    end

end
